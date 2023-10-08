import type { ArrayExpression, ObjectExpression } from 'estree'
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

    // @ts-expect-error
    const frontMatter = ast.children.find(node =>
      // @ts-expect-error
      isExportNode(node, 'frontMatter')
    ).data.estree.body[0].declaration.declarations[0].init.properties

    file.data.frontMatter = estreeToValue(frontMatter)
  }

function traverseArray(
  nodes: ArrayExpression['elements'],
  result: (
    | string
    | number
    | boolean
    | null
    | unknown[]
    | Record<string, unknown>
  )[] = []
) {
  for (const node of nodes) {
    if (!node) continue

    if (node.type === 'Literal') {
      // @ts-expect-error
      result.push(node.value)
      continue
    }
    if (node.type === 'ObjectExpression') {
      result.push(estreeToValue(node.properties))
      continue
    }
    if (node.type === 'ArrayExpression') {
      result.push(traverseArray(node.elements))
    }
  }
  return result
}

function estreeToValue(
  nodes: ObjectExpression['properties'],
  result: Record<string, unknown> = Object.create(null)
) {
  for (const node of nodes) {
    if (node.type !== 'Property') continue
    const { key, value } = node

    const keyName =
      key.type === 'Literal'
        ? (key.value as string)
        : key.type === 'Identifier'
        ? key.name
        : ''
    if (value.type === 'Literal') {
      result[keyName] = value.value
    } else if (value.type === 'ObjectExpression') {
      result[keyName] = estreeToValue(value.properties)
    } else if (value.type === 'ArrayExpression') {
      result[keyName] = traverseArray(value.elements)
    }
  }
  return result
}
