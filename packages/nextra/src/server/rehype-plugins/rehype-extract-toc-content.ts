import type { SpreadElement } from 'estree'
import type { Element, Root } from 'hast'
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
    // @ts-expect-error
    const { children } = toEstree(node).body[0].expression

    const isText = children.every(
      // @ts-expect-error
      child =>
        child.type === 'JSXExpressionContainer' &&
        child.expression.type === 'Literal'
    )

    const result = isText
      ? // @ts-expect-error
        children.map(n => n.expression)[0]
      : {
          type: 'JSXFragment',
          openingFragment: { type: 'JSXOpeningFragment' },
          closingFragment: { type: 'JSXClosingFragment' },
          children
        }

    Object.assign(node, {
      type: 'mdxJsxFlowElement',
      name: node.tagName,
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'id',
          value: {
            type: 'mdxJsxAttributeValueExpression',
            data: {
              estree: {
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'MemberExpression',
                      property: { type: 'Identifier', name: 'id' },
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
      ],
      children: [
        {
          type: 'mdxFlowExpression',
          data: {
            estree: {
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'MemberExpression',
                    property: { type: 'Identifier', name: 'value' },
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
      ]
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
