// @ts-nocheck

import Slugger from 'github-slugger'
import { getFlattenedValue } from './remark-headings'
import { CODE_BLOCK_FILENAME_REGEX } from '../constants'

function visit(node, tagNames, handler) {
  if (tagNames.includes(node.tagName)) {
    handler(node)
    return
  }
  node.children?.forEach(n => visit(n, tagNames, handler))
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
  const slugger = new Slugger()

  const headingsWithSlug = new Set(['h2', 'h3', 'h4', 'h5', 'h6'])

  visit(tree, [...headingsWithSlug, 'div', 'pre'], node => {
    if (headingsWithSlug.has(node.tagName)) {
      // Attach slug
      node.properties.id ||= slugger.slug(getFlattenedValue(node))
      return
    }

    if ('data-rehype-pretty-code-fragment' in node.properties) {
      // remove <div data-rehype-pretty-code-fragment /> element that wraps <pre /> element
      // because we'll wrap with our own <div />
      Object.assign(node, node.children[0])
    }

    node.properties.filename = node.__nextra_filename
    node.properties.hasCopyCode = node.__nextra_hasCopyCode
  })
}
