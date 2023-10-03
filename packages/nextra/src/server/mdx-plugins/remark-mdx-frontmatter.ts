import type { Property } from 'estree'
import { valueToEstree } from 'estree-util-value-to-estree'
import type { Parent, Root } from 'mdast'
import type { Plugin } from 'unified'
import { parse as parseYaml } from 'yaml'
import { createAstExportConst } from '../utils.js'
import { isExportNode } from './remark-mdx-title.js'

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

export const remarkMdxFrontMatter: Plugin<[], Root> =
  () => (ast: Parent, file) => {
    const yamlNodeIndex = ast.children.findIndex(node => node.type === 'yaml')
    const esmNodeIndex = ast.children.findIndex((node: any) =>
      isExportNode(node, 'frontMatter')
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

    const frontMatter = ast.children.find(node =>
      isExportNode(node, 'frontMatter')
    ).data.estree.body[0].declaration.declarations[0].init.properties

    function traverseArray(nodes, result = []) {
      for (const node of nodes) {
        if (node.type === 'Literal') {
          result.push(node.value)
          continue
        }
        if (node.type === 'ObjectExpression') {
          result.push(traverse(node.properties))
          continue
        }
        if (node.type === 'ArrayExpression') {
          result.push(traverseArray(node.elements))
          continue
        }
      }
      return result
    }

    function traverse(astPropertyNode: Property[], result = {}) {
      for (const { key, value } of astPropertyNode) {
        const keyName =
          key.type === 'Literal'
            ? key.value
            : key.type === 'Identifier'
            ? key.name
            : ''
        if (value.type === 'Literal') {
          result[keyName] = value.value
        } else if (value.type === 'ObjectExpression') {
          result[keyName] = traverse(value.properties)
        } else if (value.type === 'ArrayExpression') {
          const val = traverseArray(value.elements)
          result[keyName] = val
        }
      }
      return result
    }

    file.data.frontMatter = traverse(frontMatter)
  }
