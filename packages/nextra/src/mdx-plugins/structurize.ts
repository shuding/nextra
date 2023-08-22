// @ts-nocheck
function cleanup(content: string): string {
  return content
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
}

export function structurize(
  structurizedData: Record<string, unknown>,
  options
) {
  if (typeof options === 'boolean') {
    options = {}
  }
  options = { codeblocks: true, ...options }
  let activeSlug = ''
  let skip = false
  let content = ''

  return () => {
    return node => {
      walk(node)
      structurizedData[activeSlug] = cleanup(content)
      return node
    }

    function walk(node): string {
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
        for (const child of node.children) {
          result += walk(child)
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
      } else if (type === 'heading') {
        skip = false
        if (node.depth > 1) {
          structurizedData[activeSlug] = cleanup(content)
          content = ''
          activeSlug = node.data.hProperties.id + '#' + result
        }
      }
      return result
    }
  }
}
