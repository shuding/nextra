import { toEstree } from 'hast-util-to-estree'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const rehypeExtractTocContent: Plugin<[], any> = () => (ast, file) => {
  const toc: any[] = []

  visit(ast, 'element', node => {
    if (!/^h[2-6]$/.test(node.tagName)) return

    const { id } = node.properties
    if (id) {
      toc.push(structuredClone(node))
      node.children = []
    }
  })

  const elements = toc
    .map(t => toEstree(t))
    .map(n => n.body[0].expression)
    .map((node, i) => {
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
            value: { type: 'Literal', value: toc[i].properties.id },
            kind: 'init'
          },
          {
            type: 'Property',
            key: { type: 'Identifier', name: 'depth' },
            value: { type: 'Literal', value: Number(toc[i].tagName[1]) },
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
              id: { type: 'Identifier', name: 'useToc' },
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
            },
          }
        ]
      }
    }
  })

  file.data.toc = toc
}
