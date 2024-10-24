import { rendererRich, type RendererRichOptions } from '@shikijs/twoslash'
import type { Element, ElementContent, Root } from 'hast'
import type { Code } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { defaultHandlers, toHast } from 'mdast-util-to-hast'
import type { ShikiTransformerContextCommon } from 'shiki'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

const TWOSLASH_POPUP_IMPORT_AST = {
  type: 'mdxjsEsm',
  data: {
    estree: {
      body: [
        {
          type: 'ImportDeclaration',
          source: { type: 'Literal', value: 'nextra/components' },
          specifiers: ['Popup', 'PopupTrigger', 'PopupPanel'].map(name => ({
            type: 'ImportSpecifier',
            imported: { type: 'Identifier', name },
            local: { type: 'Identifier', name }
          }))
        }
      ]
    }
  }
} as any

export const rehypeTwoslashPopup: Plugin<[], Root> = () => ast => {
  // The tagName is being converted to lowercase when calling the shiki.codeToHtml method inside rehypePrettyCode.
  // convert it back to Uppercase.
  visit(ast, { tagName: 'popup' }, node => {
    node.tagName = 'Popup'
  })
  visit(ast, { tagName: 'popuptrigger' }, node => {
    node.tagName = 'PopupTrigger'
  })
  visit(ast, { tagName: 'popuppanel' }, node => {
    node.tagName = 'PopupPanel'
  })

  let hasTwoslash = false
  visit(ast, { tagName: 'code' }, node => {
    if (hasTwoslash) {
      return
    }

    if (node.data?.meta === 'twoslash') {
      hasTwoslash = true
    }
  })
  if (hasTwoslash) {
    ast.children.unshift(TWOSLASH_POPUP_IMPORT_AST)
  }
}

export function twoslashRenderer(options?: RendererRichOptions) {
  return rendererRich({
    ...options,
    renderMarkdown,
    renderMarkdownInline,
    hast: {
      hoverToken: {
        tagName: 'Popup'
      },
      hoverPopup: {
        tagName: 'PopupPanel'
      },
      hoverCompose: ({ popup, token }) => [
        popup,
        {
          type: 'element',
          tagName: 'PopupTrigger',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: {
                class: 'twoslash-hover'
              },
              children: [token]
            }
          ]
        }
      ],
      ...options?.hast
    }
  })
}

function renderMarkdown(
  this: ShikiTransformerContextCommon,
  md: string
): ElementContent[] {
  const mdast = fromMarkdown(
    md.replace(/{@link (?<link>[^}]*)}/g, '$1'), // replace jsdoc links
    { mdastExtensions: [gfmFromMarkdown()] }
  )

  return (
    toHast(mdast, {
      handlers: {
        code: (state, node: Code) => {
          if (node.lang) {
            return this.codeToHast(node.value, {
              ...this.options,
              transformers: [],
              meta: {
                __raw: node.meta ?? undefined
              },
              lang: node.lang
            }).children[0] as Element
          }

          return defaultHandlers.code(state, node)
        }
      }
    }) as Element
  ).children
}

function renderMarkdownInline(
  this: ShikiTransformerContextCommon,
  md: string,
  context?: string
): ElementContent[] {
  const text =
    context === 'tag:param' ? md.replace(/^(?<link>[\w$-]+)/, '`$1` ') : md

  const children = renderMarkdown.call(this, text)
  if (
    children.length === 1 &&
    children[0].type === 'element' &&
    children[0].tagName === 'p'
  )
    return children[0].children
  return children
}
