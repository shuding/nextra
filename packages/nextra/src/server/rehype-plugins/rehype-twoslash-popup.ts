import type { ImportDeclaration } from 'estree'
import type { Root } from 'hast'
import type { MdxjsEsmHast } from 'mdast-util-mdxjs-esm'
import type { Plugin, Transformer } from 'unified'
import { EXIT, visit } from 'unist-util-visit'

const TWOSLASH_POPUP_IMPORT_AST = {
  type: 'mdxjsEsm',
  data: {
    estree: {
      body: [
        {
          type: 'ImportDeclaration',
          source: { type: 'Literal', value: 'nextra/components' },
          specifiers: [
            {
              type: 'ImportSpecifier',
              imported: { type: 'Identifier', name: 'Popup' },
              local: { type: 'Identifier', name: 'Popup' }
            }
          ]
        } satisfies ImportDeclaration
      ]
    }
  }
} as MdxjsEsmHast

const transformer: Transformer<Root> = ast => {
  // The tagName is being converted to lowercase when calling the shiki.codeToHtml
  // method inside rehypePrettyCode. Convert it back to Uppercase.
  visit(
    ast,
    [
      { tagName: 'popup' },
      { tagName: 'popupbutton' },
      { tagName: 'popuppanel' }
    ],
    node => {
      const n = node as { tagName: string }
      const tagName = {
        popup: 'Popup',
        popupbutton: 'Popup.Button',
        popuppanel: 'Popup.Panel'
      }[n.tagName]!
      n.tagName = tagName
    }
  )

  visit(ast, { tagName: 'code' }, node => {
    if (node.data?.meta === 'twoslash') {
      ast.children.unshift(TWOSLASH_POPUP_IMPORT_AST)
      return EXIT
    }
  })
}

export const rehypeTwoslashPopup: Plugin<[], Root> = () => transformer
