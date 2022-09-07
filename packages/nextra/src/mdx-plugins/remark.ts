import { Processor } from '@mdx-js/mdx/lib/core'
import { visit } from 'unist-util-visit'
import { Plugin } from 'unified'
import { Root, Heading, Parent } from 'mdast'
import { PageOpts } from '../types'

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
    headingMeta: Pick<PageOpts, 'headings' | 'hasJsxInH1'>
  }
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
          const heading = {
            ...(node as Heading),
            value: getFlattenedValue(node)
          }
          data.headingMeta.headings.push(heading)
          if (hasJsxInH1) {
            data.headingMeta.hasJsxInH1 = true
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
