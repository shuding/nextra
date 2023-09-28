import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const rehypeExtractTocContent: Plugin<[], any> = () => (ast, file) => {
  // @ts-expect-error
  file.toc = {}
  visit(ast, 'heading', node => {
    if (node.depth === 1) return
    file.toc[node.data.hProperties.id] = node.children
    node.children = []
  })
}
