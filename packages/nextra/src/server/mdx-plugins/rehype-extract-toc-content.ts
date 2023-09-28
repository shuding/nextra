import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

const ALLOWED_HEADING_NAMES = new Set(['h2', 'h3', 'h4', 'h5', 'h6'])

export const rehypeExtractTocContent: Plugin<[], any> = () => (ast, file) => {
  const toc: Record<string, any[]> = {}

  visit(ast, 'element', node => {
    if (!ALLOWED_HEADING_NAMES.has(node.tagName)) return
    toc[node.properties.id] = node.children
    node.children = []
  })

  file.data.toc = toc
}
