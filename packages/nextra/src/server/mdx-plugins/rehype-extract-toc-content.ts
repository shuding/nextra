import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const rehypeExtractTocContent: Plugin<[], any> = () => (ast, file) => {
  const toc: any[] = []

  visit(ast, 'element', node => {
    if (!/^h[2-6]$/.test(node.tagName)) return

    const { id } = node.properties
    if (id) {
      toc.push(structuredClone(node))
      node.children = []
    }
  })

  file.data.toc = toc
}
