import type { JsxAttribute } from 'estree-util-to-js/lib/jsx'
import type { Element } from 'hast'
import { toEstree } from 'hast-util-to-estree'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Heading } from '../../types'
import { TOC_HEADING_REGEX } from '../constants.js'
import { createAstObject } from '../utils.js'

export const rehypeExtractTocContent: Plugin<
  [{ isRemoteContent?: boolean }],
  any
> =
  ({
    // todo rethink this
    isRemoteContent
  }) =>
  (ast, file) => {
    const toc: any[] = []
    const idSet = new Set((file.data.toc as Heading[]).map(({ id }) => id))

    visit(ast, 'element', (node: Element) => {
      if (!TOC_HEADING_REGEX.test(node.tagName)) return

      const { id } = node.properties
      if (typeof id === 'string' && idSet.has(id)) {
        toc.push(structuredClone(node))
        if (!isRemoteContent) {
          node.children = []
        }
      }
    })

    const TocToExpression = Object.fromEntries(
      toc.map(node =>
        // @ts-expect-error
        [node.properties.id, toEstree(node).body[0].expression]
      )
    )

    // @ts-expect-error
    const elements = file.data.toc.map(n => {
      if (typeof n === 'string') {
        return {
          type: 'SpreadElement',
          argument: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: n }
          }
        }
      }

      const node = TocToExpression[n.id]

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

      return createAstObject({
        value: result,
        id: node.openingElement.attributes.find(
          (attr: JsxAttribute) => attr.name.name === 'id'
        ).value.value,
        depth: Number(node.openingElement.name.name[1])
      })
    })

    ast.children.push({
      type: 'mdxjsEsm',
      data: {
        estree: {
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration: {
                type: 'FunctionDeclaration',
                id: { type: 'Identifier', name: 'useTOC' },
                params: [{ type: 'Identifier', name: 'props' }],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: { type: 'ArrayExpression', elements }
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    })

    file.data.toc = toc
  }
