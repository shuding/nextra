import { createProcessor } from '@mdx-js/mdx'
import type { Program } from 'estree'
import remarkFrontmatter from 'remark-frontmatter'
import {
  remarkAssignFrontMatter,
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
  {
    filePath,
    lastCommitTime
  }: { filePath?: string; lastCommitTime?: number } = {}
): Promise<string> {
  const format = filePath?.endsWith('.mdx') ? 'mdx' : 'md'

  const fileCompatible = filePath ? { value: source, path: filePath } : source

  const compiler = createProcessor({
    format,
    remarkPlugins: [
      remarkFrontmatter, // parse and attach yaml node
      remarkMdxFrontMatter,
      remarkMdxTitle,
      [remarkAssignFrontMatter, { lastCommitTime }],
      remarkExportOnlyMetadata
    ],
    recmaPlugins: [
      () => (ast: Program) => {
        const [importReact] = ast.body

        ast.body = ast.body.filter(
          node =>
            node.type === 'ExportNamedDeclaration' &&
            (node.declaration as any).declarations[0].id.name === 'metadata'
        )
        ast.body.unshift(importReact)
      }
    ]
  })
  const vFile = await compiler.process(fileCompatible)

  return vFile.value as string
}
