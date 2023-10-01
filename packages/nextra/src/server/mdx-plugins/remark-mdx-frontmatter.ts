import { valueToEstree } from 'estree-util-value-to-estree'
import type { Parent, Root } from 'mdast'
import type { Plugin } from 'unified'
import { parse as parseYaml } from 'yaml'
import { createAstExportConst } from '../utils.js'

function createNode(data: Record<string, unknown>): any {
  return {
    type: 'mdxjsEsm',
    data: {
      estree: {
        body: [createAstExportConst('frontMatter', valueToEstree(data))]
      }
    }
  }
}

export const remarkMdxFrontMatter: Plugin<[], Root> = () => (ast: Parent) => {
  const yamlNodeIndex = ast.children.findIndex(node => node.type === 'yaml')
  const esmNodeIndex = ast.children.findIndex((node: any) => {
    if (node.type !== 'mdxjsEsm') return
    const name = node.data.estree.body[0].declaration?.declarations?.[0].id.name
    return name === 'frontMatter'
  })
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
    return
  }

  if (!hasEsm) {
    // Attach dummy node
    ast.children.unshift(createNode({}))
  }
}
