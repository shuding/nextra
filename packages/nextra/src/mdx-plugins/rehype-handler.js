import Slugger from 'github-slugger'
import { getFlattenedValue } from './remark'

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
    visit(tree, ['pre'], node => {
      if (
        // Block code
        Array.isArray(node.children) &&
        node.children.length === 1 &&
        node.children[0].tagName === 'code' &&
        typeof node.children[0].properties === 'object'
      ) {
        const meta =
          node.children[0].data?.meta ?? node.children[0].properties.metastring

        const hasCopy = meta
          ? (defaultShowCopyCode && !/( |^)copy=false($| )/.test(meta)) ||
            /( |^)copy($| )/.test(meta)
          : defaultShowCopyCode
        if (hasCopy) {
          node.__nextra_copy__ = true
        }

        if (!meta) {
          return
        }
        const filename = meta.match(/filename="([^"]+)"/)?.[1]
        if (filename) {
          node.__nextra_filename__ = filename
        }
      }
    })
  }

export const attachMeta = () => tree => {
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
    const preElement = node.children[0]
    if ('__nextra_copy__' in node) {
      preElement.properties['data-nextra-copy'] = ''
    }
    // Attach filename
    if ('__nextra_filename__' in node) {
      preElement.properties['data-filename'] = node.__nextra_filename__
    }
  })
}
