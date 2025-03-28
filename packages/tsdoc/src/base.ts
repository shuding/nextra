import type {
  ExportedDeclarations,
  Project,
  Symbol as TsSymbol,
  Type
} from 'ts-morph'
import { ts } from 'ts-morph'
import { getProject, type TypescriptConfig } from './get-project.js'

export interface GeneratedDoc {
  name: string
  description: string
  entries: DocEntry[]
}

export interface DocEntry {
  name: string
  description: string
  type: string
  tags: Record<string, string>
  required: boolean
}

interface EntryContext {
  program: Project
  transform?: Transformer
  type: Type
  declaration: ExportedDeclarations
}

type Transformer = (
  this: EntryContext,
  entry: DocEntry,
  propertyType: Type,
  propertySymbol: TsSymbol
) => void

interface GenerateOptions {
  /**
   * Allow fields with `@internal` tag
   * @default false
   */
  allowInternal?: boolean
  /**
   * Modify output property entry
   */
  transform?: Transformer
}

export interface GenerateDocumentationOptions extends GenerateOptions {
  /**
   * Typescript configurations
   */
  config?: TypescriptConfig
  project?: Project
}

/**
 * Generate documentation for properties in an exported type/interface
 */
export function generateDocumentation(
  file: string,
  name: string | undefined,
  content: string,
  options: GenerateDocumentationOptions = {}
): GeneratedDoc[] {
  const project = options.project ?? getProject(options.config)
  const sourceFile = project.createSourceFile(file, content, {
    overwrite: true
  })
  const out: GeneratedDoc[] = []
  for (const [k, d] of sourceFile.getExportedDeclarations()) {
    if (name && name !== k) continue
    if (!d[0]) {
      throw new Error(`Declaration '${k}' isn't found`)
    }
    if (d.length > 1) {
      console.warn(
        `Export '${k}' should not have more than one type declaration.`
      )
    }
    out.push(generate(project, k, d[0], options))
  }

  return out
}

function generate(
  program: Project,
  name: string,
  declaration: ExportedDeclarations,
  { allowInternal = false, transform }: GenerateOptions
): GeneratedDoc {
  // @ts-expect-error -- fixme
  const entryContext: EntryContext = {
    transform,
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
      (entry): entry is DocEntry =>
        !!entry && (allowInternal || !('internal' in entry.tags))
    )

  return {
    name,
    description: comment ? ts.displayPartsToString(comment) : '',
    entries
  }
}

function getDocEntry(prop: TsSymbol, context: EntryContext): DocEntry | void {
  const { transform, program } = context

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
