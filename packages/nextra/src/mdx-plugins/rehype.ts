// @ts-nocheck
import { CODE_BLOCK_FILENAME_REGEX } from '../constants'

function visit(node, tagNames, handler, parent, idx) {
  if (tagNames.includes(node.tagName)) {
    handler(node, parent, idx)
    return
  }
  if ('children' in node) {
    for (const [i, n] of node.children.entries()) {
      visit(n, tagNames, handler, node, i)
    }
  }
}

export const parseMeta =
  ({ defaultShowCopyCode }) =>
  tree => {
    visit(tree, ['pre'], preEl => {
      const [codeEl] = preEl.children
      // Add default language `text` for code-blocks without languages
      codeEl.properties.className ||= ['language-text']
      const meta = codeEl.data?.meta
      preEl.__nextra_filename = meta?.match(CODE_BLOCK_FILENAME_REGEX)?.[1]

      preEl.__nextra_hasCopyCode = meta
        ? (defaultShowCopyCode && !/( |^)copy=false($| )/.test(meta)) ||
          /( |^)copy($| )/.test(meta)
        : defaultShowCopyCode
    })
  }

export const attachMeta = () => tree => {
  visit(tree, ['div', 'pre'], (node, parent, idx) => {
    const children =
      'data-rehype-pretty-code-fragment' in node.properties
        ? node.children.map(child => ({ ...node, ...child }))
        : [node]

    for (const node of children) {
      node.properties.filename = node.__nextra_filename
      node.properties.hasCopyCode = node.__nextra_hasCopyCode
    }
    // if this is a <div data-rehype-pretty-code-fragment /> element,
    // this flattens children that wraps <pre /> element(s) into sibling nodes
    // because we'll wrap with our own <div />
    parent.children.splice(idx, 1, ...children)
  })
}
