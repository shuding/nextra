import { valueToEstree } from 'estree-util-value-to-estree'
import type { Root } from 'mdast'
import type { MdxjsEsmHast } from 'mdast-util-mdxjs-esm'
import type { Plugin, Transformer } from 'unified'
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
  } as MdxjsEsmHast
}

const transformer: Transformer<Root> = ast => {
  const yamlNodeIndex = ast.children.findIndex(node => node.type === 'yaml')
  const esmNodeIndex = ast.children.findIndex(node =>
    isExportNode(node, 'metadata')
  )
  const hasYaml = yamlNodeIndex !== -1
  const hasEsm = esmNodeIndex !== -1

  if (hasYaml) {
    if (hasEsm) {
      throw new Error(
        "Both YAML front matter and `metadata` aren't supported. Keep only 1."
      )
    }
    const node = ast.children[yamlNodeIndex] as { value: string }
    ast.children[yamlNodeIndex] = createNode(parseYaml(node.value) ?? {})
  } else if (!hasEsm) {
    // Attach empty node
    ast.children.unshift(createNode({}))
  }
}

export const remarkMdxFrontMatter: Plugin<[], Root> = () => transformer
