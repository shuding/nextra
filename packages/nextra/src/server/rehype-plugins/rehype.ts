import type { Element } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { CODE_BLOCK_FILENAME_REGEX } from '../constants.js'

type PreElement = Element & {
  __filename?: string
  __hasCopyCode?: boolean
}

export const rehypeParseCodeMeta: Plugin<
  [{ defaultShowCopyCode?: boolean }],
  any
> =
  ({ defaultShowCopyCode }) =>
  ast => {
    visit(ast, { tagName: 'pre' }, (node: PreElement) => {
      const [codeEl] = node.children as Element[]
      // @ts-expect-error fixme
      const meta = codeEl.data?.meta

      node.__filename = meta?.match(CODE_BLOCK_FILENAME_REGEX)?.[1]
      node.properties['data-filename'] = node.__filename

      node.__hasCopyCode = meta
        ? (defaultShowCopyCode && !/( |^)copy=false($| )/.test(meta)) ||
          /( |^)copy($| )/.test(meta)
        : defaultShowCopyCode
      if (node.__hasCopyCode) {
        node.properties['data-copy'] = ''
      }
    })
  }

export const rehypeAttachCodeMeta: Plugin<[], any> = () => ast => {
  visit(ast, [{ tagName: 'div' }, { tagName: 'span' }], (node: Element) => {
    const isRehypePrettyCode =
      'data-rehype-pretty-code-fragment' in node.properties
    if (!isRehypePrettyCode) return

    // remove <div data-rehype-pretty-code-fragment /> element that wraps <pre /> element
    // because we'll wrap with our own <div />
    const preEl: PreElement = Object.assign(node, node.children[0])
    delete preEl.properties['data-theme']

    if (preEl.tagName === 'pre') {
      const [codeEl] = preEl.children as Element[]
      delete codeEl.properties['data-theme']
      delete codeEl.properties['data-language']

      if (preEl.__filename) {
        preEl.properties['data-filename'] = preEl.__filename
      }
      if (preEl.__hasCopyCode) {
        preEl.properties['data-copy'] = ''
      }
      // @ts-expect-error fixme
      if (preEl.type === 'mdxJsxFlowElement') {
        // @ts-expect-error fixme
        preEl.attributes.push(
          ...Object.entries(node.properties).map(([name, value]) => ({
            type: 'mdxJsxAttribute',
            name,
            value
          }))
        )
      }
    } else {
      // remove class="line"
      // @ts-expect-error fixme
      delete node.children[0].properties.className
    }
  })
}
