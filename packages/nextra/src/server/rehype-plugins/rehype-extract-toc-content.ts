import type { SpreadElement } from 'estree'
import type { Element, Root, Text } from 'hast'
import { toEstree } from 'hast-util-to-estree'
import type { MdxjsEsm } from 'hast-util-to-estree/lib/handlers/mdxjs-esm'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Heading } from '../../types.js'
import { createAstExportConst, createAstObject } from '../utils.js'

const TOC_HEADING_RE = /^h[2-6]$/

export const rehypeExtractTocContent: Plugin<[], Root> = () => (ast, file) => {
  const TocMap: Record<string, Element> = {}
  const toc = file.data.toc as Heading[]
  const idSet = new Set(toc.map(({ id }) => id))

  visit(ast, 'element', (node: Element) => {
    if (!TOC_HEADING_RE.test(node.tagName)) return

    const id = node.properties.id as string
    if (idSet.has(id)) {
      TocMap[id] = node
    }
  })

  const elements = toc.map((name, index) => {
    if (typeof name === 'string') {
      return {
        type: 'SpreadElement',
        argument: { type: 'Identifier', name }
      } satisfies SpreadElement
    }

    const node = TocMap[name.id]

    const isTextOnly = node.children.every(child => child.type === 'text')

    const result = isTextOnly
      ? node.children.map(n => (n as Text).value).join('')
      : // @ts-expect-error
        Object.assign(toEstree(node).body[0].expression, {
          type: 'JSXFragment',
          openingFragment: { type: 'JSXOpeningFragment' },
          closingFragment: { type: 'JSXClosingFragment' }
        })

    Object.assign(node, {
      type: 'mdxJsxFlowElement',
      name: node.tagName,
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'id',
          value: createComputedKey(
            'mdxJsxAttributeValueExpression',
            index,
            'id'
          )
        }
      ],
      children: [createComputedKey('mdxFlowExpression', index, 'value')]
    })

    return createAstObject({
      value: result,
      id: node.properties.id as string,
      depth: Number(node.tagName[1])
    })
  })

  ast.children.push({
    type: 'mdxjsEsm',
    data: {
      estree: {
        body: [
          createAstExportConst('toc', { type: 'ArrayExpression', elements })
        ]
      }
    }
  } as MdxjsEsm)

  file.data.toc = TocMap
}

function createComputedKey(
  type: 'mdxFlowExpression' | 'mdxJsxAttributeValueExpression',
  index: number,
  key: string
) {
  return {
    type,
    data: {
      estree: {
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              property: { type: 'Identifier', name: key },
              object: {
                type: 'MemberExpression',
                object: { type: 'Identifier', name: 'toc' },
                property: { type: 'Literal', value: index },
                computed: true
              }
            }
          }
        ]
      }
    }
  }
}
