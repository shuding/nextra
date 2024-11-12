import { valueToEstree } from 'estree-util-value-to-estree'
import type { MdxjsEsm } from 'hast-util-to-estree/lib/handlers/mdxjs-esm'
import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { parse as parseYaml } from 'yaml'
import { createAstExportConst } from '../utils.js'
import { isExportNode } from './remark-mdx-title.js'

function createNode(data: Record<string, unknown>) {
  return {
    type: 'mdxjsEsm',
    data: {
      estree: {
        body: [createAstExportConst('metadata', valueToEstree(data))]
      }
    }
  } as MdxjsEsm
}

export const remarkMdxFrontMatter: Plugin<[], Root> =
  () => (ast: Root) => {
    const yamlNodeIndex = ast.children.findIndex(node => node.type === 'yaml')
    const esmNodeIndex = ast.children.findIndex((node: any) =>
      isExportNode(node, 'metadata')
    )
    const hasYaml = yamlNodeIndex !== -1
    const hasEsm = esmNodeIndex !== -1

    if (hasYaml) {
      if (hasEsm) {
        throw new Error(
          "Both yaml frontMatter and esm export frontMatter aren't supported. Keep only 1."
        )
      }

      const raw = (ast.children[yamlNodeIndex] as { value: string }).value
      const data = parseYaml(raw)

      ast.children[yamlNodeIndex] = createNode(data)
    } else if (!hasEsm) {
      // Attach dummy node
      ast.children.unshift(createNode({}))
    }
  }
