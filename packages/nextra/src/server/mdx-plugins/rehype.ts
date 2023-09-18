import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { CODE_BLOCK_FILENAME_REGEX } from '../constants.js'

export const parseMeta: Plugin<[{ defaultShowCopyCode?: boolean }], any> =
  ({ defaultShowCopyCode }) =>
  ast => {
    visit(ast, { tagName: 'pre' }, node => {
      const [codeEl] = node.children
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

export const attachMeta: Plugin<[], any> = () => ast => {
  visit(ast, [{ tagName: 'div' }, { tagName: 'span' }], node => {
    const isRehypePrettyCode =
      'data-rehype-pretty-code-fragment' in node.properties
    if (!isRehypePrettyCode) return

    // remove <div data-rehype-pretty-code-fragment /> element that wraps <pre /> element
    // because we'll wrap with our own <div />
    Object.assign(node, node.children[0])
    delete node.properties['data-theme']

    if (node.tagName === 'pre') {
      const [codeEl] = node.children
      delete codeEl.properties['data-theme']

      if (node.__filename) {
        node.properties['data-filename'] = node.__filename
      }
      if (node.__hasCopyCode) {
        node.properties['data-copy'] = ''
      }
    } else {
      // remove class="line"
      delete node.children[0].properties.className
    }
  })
}
