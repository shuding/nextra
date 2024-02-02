import type {
  CallExpression,
  FunctionDeclaration,
  Program,
  ReturnStatement
} from 'estree'
import type { JsxAttribute } from 'estree-util-to-js/lib/jsx'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { DEFAULT_PROPERTY_PROPS, TOC_HEADING_REGEX } from '../constants.js'

export const recmaRewriteJsx: Plugin<[], Program> =
  () => (ast: Program, file) => {
    ast.body = ast.body
      // Remove `export default MDXContent;`
      .filter(
        node =>
          node.type !== 'ExportDefaultDeclaration' ||
          // @ts-expect-error fixme
          node.declaration.name !== 'MDXContent'
      )

    const createMdxContentIndex = ast.body.findIndex(
      o => o.type === 'FunctionDeclaration' && o.id.name === '_createMdxContent'
    )

    const createMdxContent = ast.body[
      createMdxContentIndex
    ] as FunctionDeclaration

    if (file.data.hasMdxLayout) {
      ast.body.splice(createMdxContentIndex, 1)
      return
    }

    createMdxContent.id.name = 'MDXLayout'

    const tocProperties = file.data.toc as (
      | { properties: { id: string } }
      | string
    )[]

    // Do not add `const toc = useTOC(props)`
    if (!tocProperties.length) return

    const returnStatement = createMdxContent.body.body.find(
      o => o.type === 'ReturnStatement'
    ) as ReturnStatement

    const { argument } = returnStatement as any

    // if return statements doesn't wrap in fragment children will be []
    const returnBody = argument.children.length ? argument.children : [argument]

    visit({ children: returnBody }, 'JSXElement', (heading: any) => {
      const { openingElement } = heading
      const name = openingElement?.name.property?.name
      const isHeading = name && TOC_HEADING_REGEX.test(name)
      if (!isHeading) return

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
          name: `toc[${foundIndex}].id`
        }
      }

      delete openingElement.selfClosing
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
        ...openingElement,
        type: 'JSXClosingElement',
        attributes: []
      }
    })

    const useTOC = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'useTOC' },
      arguments: [{ type: 'Identifier', name: 'props' }],
      optional: false
    } satisfies CallExpression

    createMdxContent.params = [{ type: 'Identifier', name: 'props' }]
    // Needs for partial imports since we remove `export default MDXContent` for them
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
                shorthand: true,
                key: { type: 'Identifier', name: 'toc' },
                value: {
                  type: 'AssignmentPattern',
                  left: { type: 'Identifier', name: 'toc' },
                  right: useTOC
                }
              }
            ]
          },
          init: { type: 'Identifier', name: 'props' }
        }
      ]
    })
  }
