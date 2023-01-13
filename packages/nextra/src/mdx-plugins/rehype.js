import Slugger from 'github-slugger'
import { getFlattenedValue } from './remark'
import { CODE_BLOCK_FILENAME_REGEX } from '../constants'

function visit(node, tagNames, handler) {
  if (tagNames.includes(node.tagName)) {
    handler(node)
    return
  }
  node.children?.forEach(n => visit(n, tagNames, handler))
}

export const parseMeta = () => tree => {
  visit(tree, ['pre'], node => {
    const [codeEl] = node.children
    // Add default language `text` for code-blocks without languages
    codeEl.properties.className ||= ['language-text']
    node.__nextra_meta = codeEl.data?.meta
  })
}

export const attachMeta =
  ({ defaultShowCopyCode }) =>
  tree => {
    const slugger = new Slugger()

    visit(tree, ['div', 'h2', 'h3', 'h4', 'h5', 'h6'], node => {
      if (node.tagName !== 'div') {
        // Attach slug
        node.properties.id ||= slugger.slug(getFlattenedValue(node))
        return
      }
      if (!('data-rehype-pretty-code-fragment' in node.properties)) {
        return
      }
      // remove <div data-rehype-pretty-code-fragment /> element that wraps <pre /> element
      // because we'll wrap with our own <div />
      const preEl = Object.assign(node, node.children[0])
      const meta = node.__nextra_meta

      preEl.properties.hasCopyCode = meta
        ? (defaultShowCopyCode && !/( |^)copy=false($| )/.test(meta)) ||
          /( |^)copy($| )/.test(meta)
        : defaultShowCopyCode

      // Attach filename
      const filename = meta?.match(CODE_BLOCK_FILENAME_REGEX)?.[1]
      if (filename) {
        preEl.properties.filename = filename
      }
    })
  }
