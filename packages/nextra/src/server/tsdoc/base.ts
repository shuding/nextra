import type { ExportedDeclarations, Symbol as TsSymbol } from 'ts-morph'
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

type GeneratedDoc = {
  name: string
  description: string
  entries: DocEntry[]
}

type DocEntry = {
  name: string
  description: string
  type: string
  tags: Record<string, string>
  required: boolean
}

export type BaseTypeTableProps = {
  /** TypeScript source code to be processed. */
  code: string
  /**
   * Whether to flatten nested objects.
   * E.g. `{ foo: { bar: string } }` will be represented as: `{ foo.bar: string }`
   * > [!WARNING]
   * >
   * > Requires `exactOptionalPropertyTypes: true` in `tsconfig.json`
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
}: BaseTypeTableProps): GeneratedDoc {
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

  const baseFields = {
    name: exportName,
    description: comment ? ts.displayPartsToString(comment) : '',
  }

  const declarationType = declaration.getType()
  const callSignatures = declarationType.getCallSignatures()
  const isFunction = callSignatures.length > 0

  if (isFunction) {
    if (callSignatures.length > 1) {
      throw new Error("Functions with multiple signatures aren't supported yet")
    }
    const signature = callSignatures[0]! // Function can have multiple signatures
    const params = signature.getParameters()

    const typeParams = params.map(param =>
      getDocEntry(param, {
        declaration,
        flattened,
        isFunctionParameter: true
      })
    )
    const returnType = signature
      .getReturnType()
      .getText(undefined, ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)
    return {
      ...baseFields,
      tags: getTags(declarationType.getSymbol()!),
      // @ts-expect-error
      params: typeParams,
      return: {
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
      getDocEntry(prop, {
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
    ...baseFields,
    entries
  }
}

function getDocEntry(
  prop: TsSymbol,
  {
    declaration,
    flattened,
    prefix = '',
    isFunctionParameter = false
  }: {
    declaration: ExportedDeclarations
    flattened: boolean
    prefix?: string
    /** @default false */
    isFunctionParameter?: boolean
  }
): DocEntry | DocEntry[] {
  const originalSubType = project
    .getTypeChecker()
    .getTypeOfSymbolAtLocation(prop, declaration)
  const subType = isFunctionParameter
    ? originalSubType.getNonNullableType()
    : originalSubType

  if (flattened && subType.isObject() && !subType.isArray()) {
    return subType.getProperties().flatMap(childProp =>
      getDocEntry(childProp, {
        declaration,
        flattened,
        prefix: isFunctionParameter
          ? prop.getName().replace(/^_+/, '') +
            (originalSubType.isNullable() ? '?' : '')
          : prop.getName()
      })
    )
  }
  const tags = getTags(prop)
  let typeName = subType.getText(
    undefined,
    ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
  )

  const aliasSymbol = subType.getAliasSymbol()

  if (aliasSymbol && !subType.getAliasTypeArguments().length) {
    typeName = aliasSymbol.getEscapedName()
  }
  if (tags.remarks) {
    typeName = /^`(?<name>.+)`/.exec(tags.remarks)?.[1] ?? typeName
  }
  const name = prop.getName()
  return {
    name: prefix ? [prefix, name].join('.') : name,
    description: ts.displayPartsToString(
      prop.compilerSymbol.getDocumentationComment(compilerObject)
    ),
    tags,
    type: typeName,
    required: !prop.isOptional()
  }
}

function getTags(prop: TsSymbol): DocEntry['tags'] {
  return Object.fromEntries(
    prop
      .getJsDocTags()
      .map(tag => [tag.getName(), ts.displayPartsToString(tag.getText())])
  )
}
