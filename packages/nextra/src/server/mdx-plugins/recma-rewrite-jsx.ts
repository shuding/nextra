import type { FunctionDeclaration, Program, ReturnStatement } from 'estree'
import type { JsxAttribute } from 'estree-util-to-js/lib/jsx'
import type { Plugin } from 'unified'
import { DEFAULT_PROPERTY_PROPS } from '../constants.js'

const HEADING_NAMES = new Set(['h2', 'h3', 'h4', 'h5', 'h6'])

export const recmaRewriteJsx: Plugin<[], Program> = () => (ast, file) => {
  const createMdxContent = ast.body.find(
    o => o.type === 'FunctionDeclaration' && o.id!.name === '_createMdxContent'
  ) as FunctionDeclaration
  const returnStatement = createMdxContent.body.body.find(
    o => o.type === 'ReturnStatement'
  ) as ReturnStatement

  // @ts-expect-error
  function isHeading(o): boolean {
    const name = o.openingElement?.name.property?.name
    return name && HEADING_NAMES.has(name)
  }

  const { argument } = returnStatement as any

  const headings =
    // if return statements doesn't wrap in fragment children will be []
    (argument.children.length ? argument.children : [argument]).filter(
      isHeading
    )

  const tocProperties = file.data.toc as (
    | { properties: { id: string } }
    | string
  )[]

  for (const heading of headings) {
    const idNode = heading.openingElement.attributes.find(
      (attr: JsxAttribute) => attr.name.name === 'id'
    )

    const id = idNode.value.value

    const foundIndex = tocProperties.findIndex(node => {
      if (typeof node === 'string') return
      return node.properties.id === id
    })

    if (foundIndex === -1) continue

    idNode.value = {
      type: 'JSXExpressionContainer',
      expression: {
        type: 'Identifier',
        name: `toc[${foundIndex}].id`
      }
    }

    delete heading.openingElement.selfClosing
    heading.children = [
      {
        type: 'JSXExpressionContainer',
        expression: {
          type: 'Identifier',
          name: `toc[${foundIndex}].value`
        }
      }
    ]
    heading.closingElement = {
      ...heading.openingElement,
      type: 'JSXClosingElement',
      attributes: []
    }
  }
  const mdxContent = ast.body.find(
    // @ts-expect-error
    node => node.type === 'FunctionDeclaration' && node.id.name === 'MDXContent'
  )
  // @ts-expect-error
  mdxContent.body.body.unshift({
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        object: { type: 'Identifier', name: 'props' },
        property: { type: 'Identifier', name: 'toc' }
      },
      right: {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'useTOC' },
        arguments: [{ type: 'Identifier', name: 'props' }]
      }
    }
  })

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
