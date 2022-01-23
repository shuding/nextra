function visit(node, tagName, handler) {
  if (node.tagName === tagName) {
    handler(node)
    return
  }
  if (node.children) {
    node.children.forEach(n => visit(n, tagName, handler))
  }
}

export function parseCodeMeta() {
  return tree => {
    visit(tree, 'pre', node => {
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

export function attachCodeMeta() {
  return tree => {
    visit(tree, 'div', node => {
      if (!('data-rehype-pretty-code-fragment' in node.properties)) return
      node.properties['data-nextra-code'] = ''
      if ('__nextra_filename__' in node) {
        node.properties['data-filename'] = node.__nextra_filename__
      }
    })
  }
}
