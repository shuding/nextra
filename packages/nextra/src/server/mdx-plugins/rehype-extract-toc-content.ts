import { toEstree } from 'hast-util-to-estree'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const rehypeExtractTocContent: Plugin<[], any> = () => (ast, file) => {
  const toc: any[] = []

  visit(ast, 'element', node => {
    if (!/^h[2-6]$/.test(node.tagName)) return

    const { id } = node.properties
    if (typeof id === 'string') {
      toc.push(structuredClone(node))
      node.children = []
    }
  })

  const TocToExpression = Object.fromEntries(
    toc.map(node =>
      // @ts-expect-error
      [node.properties.id, toEstree(node).body[0].expression]
    )
  )

  // @ts-expect-error
  const elements = file.data.toc.map((n, i) => {
    if (typeof n === 'string') {
      return {
        type: 'SpreadElement',
        argument: { type: 'Identifier', name: n }
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

    return {
      type: 'ObjectExpression',
      properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'value' },
          value: result,
          kind: 'init'
        },
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'id' },
          value: {
            type: 'Literal',
            value: node.openingElement.attributes.find(
              // @ts-expect-error
              attr => attr.name.name === 'id'
            ).value.value
          },
          kind: 'init'
        },
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'depth' },
          value: {
            type: 'Literal',
            value: Number(node.openingElement.name.name[1])
          },
          kind: 'init'
        }
      ]
    }
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
