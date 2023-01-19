// @ts-nocheck

import Slugger from 'github-slugger'

function cleanup(content) {
  return content
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
}

export const structurize = (structurizedData, options) => {
  if (typeof options === 'boolean') {
    options = {}
  }
  options = { codeblocks: true, ...options }

  const slugger = new Slugger()
  let activeSlug = ''
  let skip = false
  let content = ''

  return function stripMarkdown() {
    // @ts-expect-error: assume content model (for root) matches.
    return node => {
      walk(node)
      structurizedData[activeSlug] = cleanup(content)
      return node
    }

    /**
     * @param {Node} node
     * @returns {string}
     */
    function walk(node) {
      let result = ''

      /** @type {Type} */
      const { type } = node

      if (type === 'heading') {
        skip = true
      }

      if (
        ['code', 'table', 'blockquote', 'list', 'mdxJsxFlowElement'].includes(
          type
        )
      ) {
        result += '\n'
        if (!skip) {
          content += '\n'
        }
      }

      if ('children' in node) {
        for (let i = 0; i < node.children.length; i++) {
          result += walk(node.children[i])
        }
      } else if (
        [
          options.codeblocks ? 'code' : '',
          'text',
          'inlineCode',
          'tableCell'
        ].includes(type)
      ) {
        result += node.value
        if (!skip) {
          content += node.value
        }
      }

      if (
        [
          'code',
          'table',
          'blockquote',
          'list',
          'listItem',
          'break',
          'mdxJsxFlowElement'
        ].includes(type)
      ) {
        result += '\n'
        if (!skip) {
          content += '\n'
        }
      }
      if (type === 'tableCell') {
        result += '\t'
        if (!skip) {
          content += '\t'
        }
      }

      if (type === 'heading') {
        skip = false
      }

      if (type === 'heading' && node.depth > 1) {
        structurizedData[activeSlug] = cleanup(content)
        content = ''
        activeSlug = slugger.slug(result) + '#' + result
      }

      return result
    }
  }
}
