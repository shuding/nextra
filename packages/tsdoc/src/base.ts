import type { ExportedDeclarations, Symbol as TsSymbol } from 'ts-morph'
import { Project, ts } from 'ts-morph'

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
  skipAddingFilesFromTsConfig: true
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
   * @default 'default'
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
  const entries = declaration
    .getType()
    .getProperties()
    .flatMap(prop => getDocEntry(prop, { declaration, flattened }))
    .filter(entry => !('internal' in entry.tags))
  if (!entries.length) {
    throw new Error(
      `No properties found, check if your type "${declaration.getType().getText()}" exist`
    )
  }

  return {
    name: exportName,
    description: comment ? ts.displayPartsToString(comment) : '',
    entries
  }
}

function getDocEntry(
  prop: TsSymbol,
  {
    declaration,
    flattened,
    prefix = ''
  }: { declaration: ExportedDeclarations; flattened: boolean; prefix?: string }
): DocEntry | DocEntry[] {
  const subType = project
    .getTypeChecker()
    .getTypeOfSymbolAtLocation(prop, declaration)

  if (flattened && subType.isObject()) {
    return subType.getProperties().flatMap(childProp =>
      getDocEntry(childProp, {
        declaration,
        flattened,
        prefix: prop.getName()
      })
    )
  }

  const tags = Object.fromEntries(
    prop
      .getJsDocTags()
      .map(tag => [tag.getName(), ts.displayPartsToString(tag.getText())])
  )
  let typeName = subType
    .getNonNullableType()
    .getText(undefined, ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)

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
