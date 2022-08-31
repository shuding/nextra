import Slugger from 'github-slugger'
import { getFlattenedValue } from './remark'

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
    node.__nextra_meta__ = codeEl.data?.meta
    node.__nextra_text__ = codeEl.children[0].value
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
      const meta = node.__nextra_meta__
      const hasCopy = meta
        ? (defaultShowCopyCode && !/( |^)copy=false($| )/.test(meta)) ||
          /( |^)copy($| )/.test(meta)
        : defaultShowCopyCode

      const [preEl] = node.children
      if (hasCopy) {
        preEl.properties.value = JSON.stringify(node.__nextra_text__)
      }

      // Attach filename
      const filename = meta?.match(/filename="([^"]+)"/)?.[1]
      if (filename) {
        preEl.properties.filename = filename
      }
    })
  }
