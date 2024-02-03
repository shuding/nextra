import { createProcessor } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import {
  remarkExportOnlyMetadata,
  remarkMdxFrontMatter,
  remarkMdxTitle
} from './remark-plugins/index.js'

/**
 * `nextra-page-map.mjs` imports all `metadata` from md/mdx files to build `pageMap`, compile mdx to
 *  jsx is unnecessary if request comes from `nextra-page-map.mjs`and can be skipped to improve
 *  performance on development environment
 */

export async function compileMetadata(
  source: string,
  { filePath = '' }: { filePath?: string } = {}
): Promise<string> {
  const format = filePath.endsWith('.mdx') ? 'mdx' : 'md'

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
      () => ast => {
        ast.body = ast.body.filter(
          (node: any) =>
            node.type === 'ExportNamedDeclaration' &&
            node.declaration?.declarations[0].id.name === 'metadata'
        )
      }
    ]
  })
  const vFile = await compiler.process(fileCompatible)

  return vFile.value as string
}
