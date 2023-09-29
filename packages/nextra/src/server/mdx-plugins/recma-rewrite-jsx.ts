import type { FunctionDeclaration, Program, ReturnStatement } from 'estree'
import type { JsxAttribute } from 'estree-util-to-js/lib/jsx'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { DEFAULT_PROPERTY_PROPS } from '../constants.js'

const HEADING_NAMES = new Set(['h2', 'h3', 'h4', 'h5', 'h6'])

export const recmaRewriteJsx: Plugin<[], Program> = () => (ast, file) => {
  const createMdxContent = ast.body.find(
    o => o.type === 'FunctionDeclaration' && o.id!.name === '_createMdxContent'
  ) as FunctionDeclaration

  const mdxContent = ast.body.find(
    node =>
      node.type === 'FunctionDeclaration' && node.id!.name === 'MDXContent'
  ) as FunctionDeclaration

  if (!mdxContent) {
    throw new Error('`MDXContent` not found!')
  }

  const returnStatement = createMdxContent.body.body.find(
    o => o.type === 'ReturnStatement'
  ) as ReturnStatement

  const { argument } = returnStatement as any

  // if return statements doesn't wrap in fragment children will be []
  const returnBody = argument.children.length ? argument.children : [argument]

  const tocProperties = file.data.toc as (
    | { properties: { id: string } }
    | string
  )[]

  visit(
    // @ts-expect-error -- fixes type error
    { children: returnBody },
    'JSXElement',
    (heading: any, _index, parent) => {
      const { openingElement } = heading
      const name = openingElement?.name.property?.name
      const isHeading = name && HEADING_NAMES.has(name)
      // @ts-expect-error -- fixes type error
      const isFootnotes = parent.openingElement?.attributes.some(
        (attr: JsxAttribute) => attr.name.name === 'data-footnotes'
      )
      if (!isHeading || isFootnotes) return
      const idNode = openingElement.attributes.find(
        (attr: JsxAttribute) => attr.name.name === 'id'
      )
      if (!idNode) return

      const id = idNode.value.value

      const foundIndex = tocProperties.findIndex(node => {
        if (typeof node === 'string') return
        return node.properties.id === id
      })

      if (foundIndex === -1) return
      idNode.value = {
        type: 'JSXExpressionContainer',
        expression: {
          type: 'Identifier',
          name: `toc[${foundIndex}][0]`
        }
      }

      delete openingElement.selfClosing
      heading.children = [
        {
          type: 'JSXExpressionContainer',
          expression: {
            type: 'Identifier',
            name: `toc[${foundIndex}][1]`
          }
        }
      ]
      heading.closingElement = {
        ...openingElement,
        type: 'JSXClosingElement',
        attributes: []
      }
    }
  )

  mdxContent.body.body.unshift(
    {
      type: 'VariableDeclaration',
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name: 'toc' },
          init: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useTOC' },
            arguments: [{ type: 'Identifier', name: 'props' }],
            optional: false
          }
        }
      ]
    },
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '=',
        left: { type: 'Identifier', name: 'props' },
        right: {
          type: 'ObjectExpression',
          properties: [
            {
              type: 'SpreadElement',
              argument: { type: 'Identifier', name: 'props' }
            },
            {
              ...DEFAULT_PROPERTY_PROPS,
              key: { type: 'Identifier', name: 'toc' },
              value: { type: 'Identifier', name: 'toc' },
              shorthand: true
            }
          ]
        }
      }
    }
  )

  createMdxContent.body.body.unshift({
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'ObjectPattern',
          properties: [
            {
              ...DEFAULT_PROPERTY_PROPS,
              key: { type: 'Identifier', name: 'toc' },
              value: { type: 'Identifier', name: 'toc' },
              shorthand: true
            }
          ]
        },
        init: { type: 'Identifier', name: 'props' }
      }
    ]
  })
}
