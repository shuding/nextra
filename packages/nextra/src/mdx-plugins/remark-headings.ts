import type { Processor } from '@mdx-js/mdx/lib/core'
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Parent } from 'mdast'
import Slugger from 'github-slugger'
import type { PageOpts } from '../types'
import type { HProperties } from './remark-custom-heading-id'

export const getFlattenedValue = (node: Parent): string =>
  node.children
    .map(child =>
      'children' in child
        ? getFlattenedValue(child)
        : 'value' in child
        ? child.value
        : ''
    )
    .join('')

export const remarkHeadings: Plugin<[], Root> = function (this: Processor) {
  const data = this.data() as {
    headingMeta: Pick<PageOpts, 'headings' | 'hasJsxInH1' | 'title'>
  }
  const slugger = new Slugger()
  return (tree, _file, done) => {
    visit(
      tree,
      [
        // Match headings and <details>
        { type: 'heading' },
        { name: 'summary' },
        { name: 'details' }
      ],
      node => {
        if (node.type === 'heading') {
          const hasJsxInH1 =
            node.depth === 1 &&
            Array.isArray(node.children) &&
            node.children.some(
              (child: { type: string }) => child.type === 'mdxJsxTextElement'
            )
          const value = getFlattenedValue(node)
          const heading = {
            depth: node.depth,
            value,
            id:
              (node.data?.hProperties as HProperties)?.id || slugger.slug(value)
          }
          data.headingMeta.headings.push(heading)
          if (hasJsxInH1) {
            data.headingMeta.hasJsxInH1 = true
          }
          if (node.depth === 1) {
            data.headingMeta.title = heading.value
          }

          return
        }

        // Replace the <summary> and <details> with customized components.
        if (node.data) {
          delete node.data._mdxExplicitJsx
        }
      }
    )
    done()
  }
}
