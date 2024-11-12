import type { JsxAttribute } from 'estree-util-to-js/lib/jsx'
import type { Element, Root } from 'hast'
import { toEstree } from 'hast-util-to-estree'
import type { MdxjsEsm } from 'hast-util-to-estree/lib/handlers/mdxjs-esm'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Heading } from '../../types.js'
import { createAstExportConst, createAstObject } from '../utils.js'

const TOC_HEADING_RE = /^h[2-6]$/

export const rehypeExtractTocContent: Plugin<[], Root> = () => (ast, file) => {
  const toc: any[] = []
  const idSet = new Set((file.data.toc as Heading[]).map(({ id }) => id))

  visit(ast, 'element', (node: Element) => {
    if (!TOC_HEADING_RE.test(node.tagName)) return

    const { id } = node.properties
    if (typeof id === 'string' && idSet.has(id)) {
      toc.push(node)
    }
  })

  const TocToExpression = Object.fromEntries(
    toc.map(node => [node.properties.id, node])
  )

  // @ts-expect-error
  const elements = file.data.toc.map((n, index) => {
    if (typeof n === 'string') {
      return {
        type: 'SpreadElement',
        argument: { type: 'Identifier', name: n }
      }
    }

    const originalNode = TocToExpression[n.id]
    // @ts-expect-error
    const node = toEstree(originalNode).body[0].expression

    const isText = node.children.every(
      // @ts-expect-error
      child =>
        child.type === 'JSXExpressionContainer' &&
        child.expression.type === 'Literal'
    )

    const result = isText
      ? // @ts-expect-error
        node.children.map(n => n.expression)[0]
      : {
          type: 'JSXFragment',
          openingFragment: { type: 'JSXOpeningFragment' },
          closingFragment: { type: 'JSXClosingFragment' },
          children: node.children
        }

    const ast = createAstObject({
      value: result,
      id: node.openingElement.attributes.find(
        (attr: JsxAttribute) => attr.name.name === 'id'
      ).value.value,
      depth: Number(node.openingElement.name.name[1])
    })

    Object.assign(originalNode, {
      type: 'mdxJsxFlowElement',
      name: originalNode.tagName,
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

    return ast
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

  file.data.toc = toc
}
