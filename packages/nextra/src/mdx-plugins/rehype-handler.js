import Slugger from 'github-slugger'

import { getFlattenedValue } from './heading'

function visit(node, tagNames, handler) {
  if (tagNames.includes(node.tagName)) {
    handler(node)
    return
  }
  if (node.children) {
    node.children.forEach(n => visit(n, tagNames, handler))
  }
}

export function parseMeta() {
  return tree => {
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

        if (meta) {
          const filename = meta.match(/filename="([^"]+)"/)?.[1]
          if (filename) {
            node.__nextra_filename__ = filename
          }
        }
      }
    })
  }
}

export function attachMeta() {
  return tree => {
    const slugger = new Slugger()

    visit(tree, ['div', 'h2', 'h3', 'h4', 'h5', 'h6'], node => {
      if (node.tagName === 'div') {
        // Attach filename
        if (!('data-rehype-pretty-code-fragment' in node.properties)) return
        node.properties['data-nextra-code'] = ''
        if ('__nextra_filename__' in node) {
          node.properties['data-filename'] = node.__nextra_filename__
        }
      } else {
        // Attach slug
        node.properties.id =
          node.properties.id || slugger.slug(getFlattenedValue(node))
      }
    })
  }
}
