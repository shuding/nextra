import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import type { Flexsearch, StructurizedData } from '../types'

function cleanup(content: string): string {
  return content
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
}

export const remarkStructurize: Plugin<[Flexsearch], Root> = options => {
  const opts = { codeblocks: true, ...(options as any) }
  const structurizedData: StructurizedData = Object.create(null)
  let activeSlug = ''
  let skip = false
  let content = ''

  return (tree, file, done) => {
    walk(tree)
    structurizedData[activeSlug] = cleanup(content)
    file.data.structurizedData = structurizedData
    done()
  }

  function walk(node: any): string {
    let result = ''
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
        opts.codeblocks ? 'code' : '',
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
