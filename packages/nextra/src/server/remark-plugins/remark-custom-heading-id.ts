import type { Root } from 'mdast'
import type { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'

export type HProperties = {
  id?: string
}

const transformer: Transformer<Root> = ast => {
  visit(ast, 'heading', node => {
    const lastChild = node.children.at(-1)
    if (!lastChild || lastChild.type !== 'text') return

    const heading = lastChild.value
    const matched = heading.match(/\s*\[#([^]+?)]\s*$/)

    if (!matched) return
    node.data ||= {}
    const headingProps: HProperties = (node.data.hProperties ||= {})
    headingProps.id = matched[1]

    lastChild.value = heading.slice(0, matched.index)
  })
}

export const remarkCustomHeadingId: Plugin<[], Root> = () => transformer
