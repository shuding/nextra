import type { ExportedDeclarations, Symbol as TsSymbol, Type } from 'ts-morph'
import { Project, ts } from 'ts-morph'

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

type GeneratedType = {
  /** Type name. */
  name: string
  /** Type description. */
  description: string
  /** Type fields. */
  entries: TypeField[]
}

type Tags = Record<string, string>

type GeneratedFunction = {
  /** Function name. */
  name: string
  /** Function description. */
  description: string
  /** Function tags. */
  tags: Tags
  /** Function parameters. */
  params: TypeField[]
  /** Function return. */
  return: {
    /** Function return description. */
    description?: string
    /** Function return type. */
    type: string
  }
}

export type TypeField = {
  /** Field name. */
  name: string
  /** Field description. */
  description: string
  /** Field tags. */
  tags: Tags
  /** Field type. */
  type: string
  /** Is field optional. */
  optional: boolean
}

export type BaseTypeTableProps = {
  /** TypeScript source code to be processed. */
  code: string
  /**
   * Whether to flatten nested objects.
   * E.g. `{ foo: { bar: string } }` will be represented as: `{ foo.bar: string }`
   * @default false
   */
  flattened?: boolean
  /**
   * The name of the exported declaration.
   * @default "default"
   */
  exportName?: string
}

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
  if (output.length > 1) {
    throw new Error(
      `Export "${exportName}" should not have more than one type declaration.`
    )
  }

  const comment = declaration
    .getSymbol()
    ?.compilerSymbol.getDocumentationComment(compilerObject)
  const description = comment ? ts.displayPartsToString(comment) : ''

  const declarationType = declaration.getType()
  const callSignatures = declarationType.getCallSignatures()
  const isFunction = callSignatures.length > 0

  if (isFunction) {
    if (callSignatures.length > 1) {
      throw new Error("Functions with multiple signatures aren't supported yet")
    }
    const signature = callSignatures[0]! // Function can have multiple signatures
    const params = signature.getParameters()

    const typeParams = params
      .flatMap(param =>
        getDocEntry({
          symbol: param,
          declaration,
          flattened,
          isFunctionParameter: true
        })
      )
      .map(entry => ({
        ...entry,
        description: entry.description.replace(/^- /, '')
      }))
    const returnType = signature
      .getReturnType()
      .getText(undefined, ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)
    const tags = getTags(declarationType.getSymbol()!)
    return {
      name: declarationType.getSymbol()!.getName(),
      description,
      tags,
      params: typeParams,
      return: {
        description: tags.returns,
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
    .filter(entry => !('internal' in entry.tags))

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

  if (flattened && subType.isObject() && !subType.isArray()) {
    return subType.getProperties().flatMap(childProp => {
      const prefix = isFunctionParameter
        ? symbol.getName().replace(/^_+/, '')
        : symbol.getName()

      return getDocEntry({
        symbol: childProp,
        declaration,
        flattened,
        prefix:
          typeof +prefix === 'number'
            ? `[${prefix}]` + (originalSubType.isNullable() ? '?' : '')
            : prefix
      })
    })
  }
  const tags = getTags(symbol)
  let typeName = getFormattedText(subType)

  const aliasSymbol = subType.getAliasSymbol()

  if (aliasSymbol && !subType.getAliasTypeArguments().length) {
    typeName = aliasSymbol.getEscapedName()
  }
  if (tags.remarks) {
    typeName = /^`(?<name>.+)`/.exec(tags.remarks)?.[1] ?? typeName
  }
  const name = symbol.getName()
  return {
    name: prefix ? [prefix, name].join('.') : name,
    description: ts.displayPartsToString(
      symbol.compilerSymbol.getDocumentationComment(compilerObject)
    ),
    tags,
    type: typeName,
    optional: symbol.isOptional()
  }
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
