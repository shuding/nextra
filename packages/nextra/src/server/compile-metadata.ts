import { createProcessor } from '@mdx-js/mdx'
import type { Program } from 'estree'
import remarkFrontmatter from 'remark-frontmatter'
import {
  remarkExportOnlyMetadata,
  remarkMdxFrontMatter,
  remarkMdxTitle
} from './remark-plugins/index.js'

/**
 * `nextra/dist/server/page-map/placeholder.js` imports all `metadata`s from `.md`/`.mdx` files to
 * build `pageMap`.
 * If a request includes the resource query `?metadata`, compiling MDX to JSX is unnecessary.
 * This step can be skipped to improve performance in the development environment.
 */
export async function compileMetadata(
  source: string,
  { filePath }: { filePath?: string } = {}
): Promise<string> {
  const format = filePath?.endsWith('.mdx') ? 'mdx' : 'md'

  const fileCompatible = filePath ? { value: source, path: filePath } : source

  const compiler = createProcessor({
    format,
    remarkPlugins: [
      remarkFrontmatter, // parse and attach yaml node
      remarkMdxFrontMatter,
      remarkMdxTitle,
      remarkExportOnlyMetadata
    ],
    recmaPlugins: [
      () => (ast: Program) => {
        const [importReact] = ast.body.splice(0, 1)

        ast.body = ast.body.filter(
          (node: any) =>
            node.type === 'ExportNamedDeclaration' &&
            node.declaration?.declarations[0].id.name === 'metadata'
        )
        ast.body.unshift(importReact)
      }
    ]
  })
  const vFile = await compiler.process(fileCompatible)

  return vFile.value as string
}
