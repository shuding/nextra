import type { ImportDeclaration, ImportSpecifier } from 'estree'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const REHYPE_ICON_DEFAULT_REPLACES: Record<string, string> = {
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

function createImport(iconName: string) {
  return {
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
                imported: { type: 'Identifier', name: iconName },
                local: { type: 'Identifier', name: iconName }
              }
            ]
          } satisfies ImportDeclaration
        ]
      }
    }
  }
}

function attachIconProp(node: any, iconName: string) {
  Object.assign(node, {
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
                  expression: { type: 'Identifier', name: iconName }
                }
              ]
            }
          }
        }
      },
      ...Object.entries(node.properties).map(([name, value]) => ({
        type: 'mdxJsxAttribute',
        name,
        value
      }))
    ]
  })
}

export const rehypeIcon: Plugin<[], any> =
  (replaces = REHYPE_ICON_DEFAULT_REPLACES) =>
  (ast: any) => {
    const isMdxJsEsm = (node: any) => node.type === 'mdxjsEsm'
    const isImportDeclaration = (node: any) =>
      node.data.estree.body[0].type === 'ImportDeclaration'
    const isImportFrom = (node: any) =>
      node.data.estree.body[0].source.value === 'nextra/icons'

    const imports = ast.children.filter(
      (node: any) =>
        isMdxJsEsm(node) && isImportDeclaration(node) && isImportFrom(node)
    )

    visit(ast, { tagName: 'div' }, node => {
      const isRehypePrettyCode =
        'data-rehype-pretty-code-fragment' in node.properties

      if (!isRehypePrettyCode) return

      const preEl = node.children[0]
      const lang = preEl.properties['data-language']
      const iconName = replaces[lang]

      if (!iconName) return

      let findImportedName = ''
      for (const { data } of imports) {
        const [{ specifiers }] = data.estree.body
        const isMatch = (specifiers as ImportSpecifier[]).some(
          spec => spec.imported.name === iconName
        )
        if (isMatch) {
          findImportedName = specifiers[0].local.name
          break
        }
      }

      if (!findImportedName) {
        const importNode = createImport(iconName)
        ast.children.push(importNode)
        imports.push(importNode)
        // console.dir(importNode, { depth: null })
      }
      attachIconProp(preEl, findImportedName || iconName)
    })
  }
