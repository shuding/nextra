import type { ExportedDeclarations, Symbol as TsSymbol, Type } from 'ts-morph'
import { Project, ts } from 'ts-morph'

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
  skipAddingFilesFromTsConfig: true
})

interface GeneratedDoc {
  name: string
  description: string
  entries: DocEntry[]
}

interface DocEntry {
  name: string
  description: string
  type: string
  tags: Record<string, string>
  required: boolean
}

interface EntryContext {
  type: Type
  declaration: ExportedDeclarations
}

export interface BaseTypeTableProps {
  /** TypeScript source code. */
  code: string
  /** Should flatten nested objects. */
  flattened?: boolean,
  /**
   * Name of exported declaration.
   * @default 'default'
   */
  exportName?: string
}

/**
 * Generate documentation for properties in an exported type/interface
 */
export function generateDocumentation(
  { code, exportName = 'default' }: BaseTypeTableProps
): GeneratedDoc {
  const sourceFile = project.createSourceFile('temp.ts', code, { overwrite: true })
  const output: ExportedDeclarations[] = []
  for (const [key, declaration] of sourceFile.getExportedDeclarations()) {
    if (key === exportName) output.push(...declaration)
  }
  const declaration = output[0]
  if (!declaration) {
    throw new Error(`Can't find "${exportName}" declaration`)
  }
  if (output.length > 1) {
    throw new Error(`Export "${exportName}" should not have more than one type declaration.`)
  }
  const entryContext: EntryContext = {
    type: declaration.getType(),
    declaration
  }
  const comment = declaration
    .getSymbol()
    ?.compilerSymbol.getDocumentationComment(
      project.getTypeChecker().compilerObject
    )
  const properties = declaration.getType().getProperties()

  const entries = properties
    .map(prop => getDocEntry(prop, entryContext))
    .filter(
      (entry) => !('internal' in entry.tags)
    )
  return {
    name: exportName,
    description: comment ? ts.displayPartsToString(comment) : '',
    entries
  }
}

function getDocEntry(prop: TsSymbol, context: EntryContext): DocEntry {
  const subType = project
    .getTypeChecker()
    .getTypeOfSymbolAtLocation(prop, context.declaration)
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

  const entry: DocEntry = {
    name: prop.getName(),
    description: ts.displayPartsToString(
      prop.compilerSymbol.getDocumentationComment(
        project.getTypeChecker().compilerObject
      )
    ),
    tags,
    type: typeName,
    required: !prop.isOptional()
  }
  console.log(entry, subType.isObject())
  return entry
}
