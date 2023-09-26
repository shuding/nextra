import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'

export const rehypeIcon: Plugin<[], any> =
  (
    replaces: Record<string, string> = {
      js: 'JavaScriptIcon',
      jsx: 'JavaScriptIcon',
      ts: 'TypeScriptIcon',
      tsx: 'TypeScriptIcon',
      md: 'MarkdownIcon',
      mdx: 'MdxIcon',
      sh: 'TerminalIcon',
      bash: 'TerminalIcon',
      css: 'CssIcon'
    }
  ) =>
  (ast: any) => {
    ast.children.push({
      type: 'mdxjsEsm',
      data: {
        estree: {
          body: [
            {
              type: 'ImportDeclaration',
              source: { type: 'Literal', value: 'nextra/icons' },
              specifiers: [
                {
                  type: 'ImportSpecifier',
                  imported: {
                    type: 'Identifier',
                    name: 'MarkdownIcon'
                  },
                  local: {
                    type: 'Identifier',
                    name: 'MarkdownIcon'
                  }
                }
              ]
            }
          ]
        }
      }
    })
    visit(ast, { tagName: 'div' }, node => {
      const isRehypePrettyCode =
        'data-rehype-pretty-code-fragment' in node.properties
      if (isRehypePrettyCode) {
        // const isMdxJsEsm = (node: any) => node.type === 'mdxjsEsm'
        // const isImportDeclaration = (node: any) =>
        //   node.data.estree.body[0].type === 'ImportDeclaration'
        // console.dir(
        //   ast.children
        //     .filter(isMdxJsEsm)
        //     .filter(isImportDeclaration),
        //   { depth: null }
        // )
        const preEl = node.children[0]
        delete preEl.tagName
        // delete preEl.properties
        Object.assign(preEl, {
          type: 'mdxJsxFlowElement',
          name: 'pre',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'icon',
              value: {
                type: 'mdxJsxAttributeValueExpression',
                value: 'MarkdownIcon',
                data: {
                  estree: {
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'Identifier',
                          name: 'MarkdownIcon'
                        }
                      }
                    ],
                    sourceType: 'module',
                    comments: []
                  }
                }
              }
            }
          ],
          data: {
            _mdxExplicitJsx: false
          }
        })

        console.log(preEl)
      }
    })
  }
