import type {
  ExportedDeclarations,
  Node,
  Symbol as TsSymbol,
  Type
} from 'ts-morph'
import { Project, ts } from 'ts-morph'
import type {
  BaseTypeTableProps,
  GeneratedFunction,
  GeneratedType,
  ReturnField,
  Tags,
  TypeField
} from './types.js'

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
  skipAddingFilesFromTsConfig: true,
  compilerOptions: {
    // Do not show `undefined` value in type for optional value
    exactOptionalPropertyTypes: true,
    // Show `null` value in type if exist
    strictNullChecks: true
  }
})

const { compilerObject } = project.getTypeChecker()

/**
 * Generate documentation for properties in an exported type/interface
 */
export function generateDocumentation({
  code,
  exportName = 'default',
  flattened = false
}: BaseTypeTableProps): GeneratedType | GeneratedFunction {
  const sourceFile = project.createSourceFile('temp.ts', code, {
    overwrite: true
  })
  const output: ExportedDeclarations[] = []
  for (const [key, declaration] of sourceFile.getExportedDeclarations()) {
    if (key === exportName) output.push(...declaration)
  }
  const declaration = output[0]
  if (!declaration) {
    throw new Error(`Can't find "${exportName}" declaration`)
  }
  // if (output.length > 1) {
  //   throw new Error(
  //     `Export "${exportName}" should not have more than one type declaration.`
  //   )
  // }

  const comment = declaration
    .getSymbolOrThrow()
    .compilerSymbol.getDocumentationComment(compilerObject)
  const description = ts.displayPartsToString(comment)

  const declarationType = declaration.getType()
  const callSignatures = declarationType.getCallSignatures()
  const isFunction = callSignatures.length > 0
  if (isFunction) {
    const tags = getTags(declarationType.getSymbolOrThrow())
    return {
      name: declarationType.getSymbolOrThrow().getName(),
      ...(description && { description }),
      ...(Object.keys(tags).length && { tags }),
      signatures: callSignatures.map(signature => {
        const params = signature.getParameters()
        const typeParams = params.flatMap(param =>
          getDocEntry({
            symbol: param,
            declaration,
            flattened,
            isFunctionParameter: true
          })
        )
        const returnType = signature.getReturnType()
        const returnsDescription =
          tags.returns && replaceJsDocLinks(tags.returns)

        const flattenedReturnType: ReturnField[] =
          flattened && isObjectType(returnType)
            ? returnType.getProperties().flatMap(childProp =>
                getDocEntry({
                  symbol: childProp,
                  declaration,
                  flattened
                })
              )
            : []

        if (flattenedReturnType.length) {
          if (returnsDescription) {
            flattenedReturnType.unshift({ description: returnsDescription })
          }
        } else {
          flattenedReturnType.push({
            ...(returnsDescription && { description: returnsDescription }),
            type: getFormattedText(returnType)
          })
        }

        return {
          params: typeParams,
          returns: flattenedReturnType
        }
      })
    }
  }

  const entries = declarationType
    .getProperties()
    .flatMap(prop =>
      getDocEntry({
        symbol: prop,
        declaration,
        flattened
      })
    )
    .filter(entry => !entry.tags || !('internal' in entry.tags))

  if (!entries.length) {
    const typeName = declarationType.getText()
    if (typeName === 'any') {
      throw new Error(
        'Your type is resolved as "any", it seems like you have an issue in "TSDoc.code" prop'
      )
    }
    throw new Error(
      `No properties found, check if your type "${typeName}" exist`
    )
  }

  return {
    name: exportName,
    description,
    entries
  }
}

function getDocEntry({
  symbol,
  declaration,
  flattened,
  prefix = '',
  isFunctionParameter = false
}: {
  symbol: TsSymbol
  declaration: ExportedDeclarations
  flattened: boolean
  prefix?: string
  /* @TODO: find a way to remove this */
  /** @default false */
  isFunctionParameter?: boolean
}): TypeField | TypeField[] {
  const originalSubType = project
    .getTypeChecker()
    .getTypeOfSymbolAtLocation(symbol, declaration)
  const subType = isFunctionParameter
    ? originalSubType.getNonNullableType()
    : originalSubType
  const typeOf = getDeclaration(symbol).getType()
  if (flattened && isObjectType(subType, typeOf)) {
    return subType.getProperties().flatMap(childProp => {
      const prefix = isFunctionParameter
        ? symbol.getName().replace(/^_+/, '')
        : symbol.getName()
      return getDocEntry({
        symbol: childProp,
        declaration,
        flattened,
        prefix:
          typeof +prefix === 'number' && !Number.isNaN(+prefix)
            ? `[${prefix}]` + (originalSubType.isNullable() ? '?' : '')
            : prefix
      })
    })
  }
  const tags = getTags(symbol)
  let typeName = typeOf.isUnknown()
    ? typeOf.getText()
    : getFormattedText(subType)

  const aliasSymbol = subType.getAliasSymbol()

  if (aliasSymbol && !subType.getAliasTypeArguments().length) {
    typeName = aliasSymbol.getEscapedName()
  }
  if (tags.remarks) {
    typeName = /^`(?<name>.+)`/.exec(tags.remarks)?.[1] ?? typeName
  }
  const name = symbol.getName()
  const typeDescription = replaceJsDocLinks(
    ts.displayPartsToString(
      symbol.compilerSymbol.getDocumentationComment(compilerObject)
    )
  ).replace(/^- /, '')
  const isOptional = isFunctionParameter
    ? // @ts-expect-error -- fixme
      getDeclaration(symbol).isOptional()
    : symbol.isOptional()

  return {
    name: prefix ? [prefix, name].join('.') : name,
    type: typeName,
    ...(typeDescription && { description: typeDescription }),
    ...(Object.keys(tags).length && { tags }),
    ...(isOptional && { optional: isOptional })
  }
}

function isObjectType(t: Type, typeOf?: Type): boolean {
  if (typeOf === undefined) {
    const symbol = t.getSymbol()
    if (symbol) {
      typeOf = getDeclaration(symbol).getType()
    }
  }
  const baseName = t.getSymbol()?.getName()
  return (
    t.isObject() &&
    !t.isArray() &&
    !t.isTuple() &&
    (!baseName || !IGNORED_TYPES.has(baseName)) &&
    // Is not function
    !t.getCallSignatures().length &&
    !typeOf?.isUnknown()
  )
}

const IGNORED_TYPES = new Set([
  'Set',
  'ReadonlySet',
  'Map',
  'ReadonlyMap',
  'ReactElement'
])

function getDeclaration(s: TsSymbol): Node {
  const parameterName = s.getName()
  const declarations = s.getDeclarations()

  // @TODO add test for ConnectionState
  // if (declarations.length > 1) {
  //   throw new Error(
  //     `"${parameterName}" should not have more than one type declaration.`
  //   )
  // }
  const declaration = declarations[0]
  if (!declaration) {
    throw new Error(`Can't find "${parameterName}" declaration`)
  }
  return declaration
}

function getTags(prop: TsSymbol): Tags {
  return Object.fromEntries(
    prop
      .getJsDocTags()
      .map(tag => [tag.getName(), ts.displayPartsToString(tag.getText())])
  )
}

function getFormattedText(t: Type): string {
  return t.getText(
    undefined,
    ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
  )
}

function replaceJsDocLinks(md: string): string {
  return md.replaceAll(/{@link (?<link>[^}]*)}/g, '$1')
}
