import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const rehypeExtractTocContent: Plugin<[], any> = () => (ast, file) => {
  const toc: Record<string, any[]> = {}

  visit(ast, 'heading', node => {
    if (node.depth === 1) return
    toc[node.data.hProperties.id] = node.children
    node.children = []
  })

  file.data.toc = toc
}
