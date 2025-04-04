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
    .getSymbol()
    ?.compilerSymbol.getDocumentationComment(compilerObject)
  const description = comment ? ts.displayPartsToString(comment) : ''

  const declarationType = declaration.getType()
  const callSignatures = declarationType.getCallSignatures()
  const isFunction = callSignatures.length > 0

  if (isFunction) {
    // if (callSignatures.length > 1) {
    //   throw new Error("Functions with multiple signatures aren't supported yet")
    // }
    const signature = callSignatures[0]! // Function can have multiple signatures
    const params = signature.getParameters()
    const typeParams = params.flatMap(param =>
      getDocEntry({
        symbol: param,
        declaration,
        flattened,
        isFunctionParameter: true
      })
    )
    const returnType = signature
      .getReturnType()
      .getText(undefined, ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)
    const tags = getTags(declarationType.getSymbol()!)
    const returnsDescription = tags.returns && replaceJsDocLinks(tags.returns)
    return {
      name: declarationType.getSymbol()!.getName(),
      description,
      tags,
      params: typeParams,
      return: {
        ...(returnsDescription && { description: returnsDescription }),
        type: returnType
      }
    }

    // const func = sourceFile.getFunctionOrThrow('useNodeConnections')
    //
    // // Get type parameters
    // const typeParams2 = func.getTypeParameters().map(tp => tp.getText())
    //
    // // Get return type
    // const returnType2 = func.getReturnType().getText()
    // console.log({typeParams2, returnType2})
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

  if (
    flattened &&
    subType.isObject() &&
    !subType.isArray() &&
    !subType.isTuple() &&
    !isSetType(subType) &&
    !isMapType(subType) &&
    // Is not function
    !subType.getCallSignatures().length &&
    !typeOf.isUnknown()
  ) {
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
    ...(typeDescription && { description: typeDescription }),
    ...(Object.keys(tags).length && { tags }),
    type: typeName,
    ...(isOptional && { optional: isOptional })
  }
}

function isSetType(type: Type): boolean {
  const baseName = type.getSymbol()?.getName()

  // Handles: Set<T>, ReadonlySet<T>
  return baseName === 'Set' || baseName === 'ReadonlySet'
}

function isMapType(type: Type): boolean {
  const baseName = type.getSymbol()?.getName()

  // Handles: Map<T>, ReadonlyMap<T>
  return baseName === 'Map' || baseName === 'ReadonlyMap'
}

function getDeclaration(s: TsSymbol): Node {
  const parameterName = s.getName()
  const declarations = s.getDeclarations()

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
