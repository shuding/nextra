import Slugger from 'github-slugger'

import { getFlattenedValue } from './remark'

function visit(node, tagNames, handler) {
  if (tagNames.includes(node.tagName)) {
    handler(node)
    return
  }
  if (node.children) {
    node.children.forEach(n => visit(n, tagNames, handler))
  }
}

export function attachMeta() {
  return tree => {
    const slugger = new Slugger()

    visit(tree, ['h2', 'h3', 'h4', 'h5', 'h6'], node => {
      // Attach slug
      node.properties.id =
        node.properties.id || slugger.slug(getFlattenedValue(node))
    })
  }
}
