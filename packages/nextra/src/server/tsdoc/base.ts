import type {
  ExportedDeclarations,
  Node,
  Symbol as TsSymbol,
  Type
} from 'ts-morph'
import { Project, ts } from 'ts-morph'
import { logger } from '../utils.js'
import type {
  BaseArgs,
  GeneratedFunction,
  GeneratedType,
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
}: BaseArgs): GeneratedType | GeneratedFunction {
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
    tags.returns &&= replaceJsDocLinks(tags.returns)
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
        let flattenedReturnType: GeneratedFunction['signatures'][number]['returns'] =
          flattened && shouldFlattenType(returnType)
            ? returnType.getProperties().flatMap(childProp =>
                getDocEntry({
                  symbol: childProp,
                  declaration,
                  flattened
                })
              )
            : []

        if (!flattenedReturnType.length) {
          flattenedReturnType = {
            type: getFormattedText(returnType)
          }
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
    ...(description && { description }),
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
  if (flattened && shouldFlattenType(subType)) {
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
  const typeOf = getDeclaration(symbol).getType()
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
  const isOptional =
    // If some union type has `undefined` -> mark as optional
    subType.getUnionTypes().some(t => t.isUndefined()) ||
    (isFunctionParameter
      ? // @ts-expect-error -- fixme
        getDeclaration(symbol).isOptional()
      : symbol.isOptional())

  return {
    name: prefix ? [prefix, name].join('.') : name,
    type: typeName,
    ...(typeDescription && { description: typeDescription }),
    ...(Object.keys(tags).length && { tags }),
    ...(isOptional && { optional: isOptional })
  }
}

function shouldFlattenType(t: Type): boolean {
  if (
    !t.isObject() ||
    t.isArray() ||
    t.isTuple() ||
    // Is not function
    t.getCallSignatures().length > 0 ||
    // Is not `unknown`
    t.getText() === '{}' ||
    // Is not empty object
    !t.getProperties().length
  ) {
    return false
  }
  try {
    const baseName = t.getSymbolOrThrow().getName()
    if (IGNORED_TYPES.has(baseName)) return false
    return t.isInterface() || baseName === '__type'
  } catch {
    logger.error(`Symbol "${t.getText()}" isn't found.`)
    return false
  }
}

const IGNORED_TYPES = new Set([
  'Date',
  'RegExp',
  'ReactElement',
  'Element',
  'CSSProperties'
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
