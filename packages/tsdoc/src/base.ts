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
  program: Project
  type: Type
  declaration: ExportedDeclarations
}

export interface BaseTypeTableProps {
  /** Set the type to generate from. */
  code: string
  /** Flatten nested objects */
  flattened?: boolean
}

export async function getTypeTableOutput({ code }: BaseTypeTableProps) {
  const output = generateDocumentation('temp.ts', 'default', code)
  if (!output.length) {
    throw new Error("Can't find `export default` statement")
  }
  return output
}

/**
 * Generate documentation for properties in an exported type/interface
 */
function generateDocumentation(
  file: string,
  name: string,
  content: string
): GeneratedDoc[] {
  const sourceFile = project.createSourceFile(file, content, { overwrite: true })
  const out: GeneratedDoc[] = []
  for (const [key, declaration] of sourceFile.getExportedDeclarations()) {
    if (name !== key) continue
    if (!declaration[0]) {
      throw new Error(`Declaration '${key}' isn't found`)
    }
    if (declaration.length > 1) {
      throw new Error(
        `Export '${key}' should not have more than one type declaration.`
      )
    }
    out.push(generate(project, key, declaration[0]))
  }
  return out
}

function generate(
  program: Project,
  name: string,
  declaration: ExportedDeclarations
): GeneratedDoc {
  const entryContext: EntryContext = {
    program,
    type: declaration.getType(),
    declaration
  }
  const comment = declaration
    .getSymbol()
    ?.compilerSymbol.getDocumentationComment(
      program.getTypeChecker().compilerObject
    )
  const properties = declaration.getType().getProperties()

  const entries = properties
    .map(prop => getDocEntry(prop, entryContext))
    .filter(
      (entry): entry is DocEntry => !!entry && !('internal' in entry.tags)
    )
  return {
    name,
    description: comment ? ts.displayPartsToString(comment) : '',
    entries
  }
}

function getDocEntry(prop: TsSymbol, context: EntryContext): DocEntry | void {
  const { program } = context

  if (context.type.isClass() && prop.getName().startsWith('#')) {
    return
  }

  const subType = program
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
        program.getTypeChecker().compilerObject
      )
    ),
    tags,
    type: typeName,
    required: !prop.isOptional()
  }

  transform?.call(context, entry, subType, prop)

  return entry
}
