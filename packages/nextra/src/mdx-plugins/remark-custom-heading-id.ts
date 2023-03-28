import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'

export type HProperties = {
  id?: string
}

export const remarkCustomHeadingId: Plugin<[], Root> =
  () => (tree, _file, done) => {
    visit(tree, 'heading', node => {
      const lastChild = node.children.at(-1)
      if (!lastChild || lastChild.type !== 'text') return

      const heading = lastChild.value
      const matched = heading.match(/\s*\[#([^]+?)]\s*$/)

      if (!matched) return
      node.data ||= {}
      node.data.hProperties ||= {} as HProperties
      ;(node.data.hProperties as HProperties).id = matched[1]

      lastChild.value = heading.slice(0, matched.index)
    })
    done()
  }
