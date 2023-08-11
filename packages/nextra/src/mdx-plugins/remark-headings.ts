import type { Processor } from '@mdx-js/mdx/lib/core'
import Slugger from 'github-slugger'
import type { Parent, Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
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

          // check if heading.id already exists in headings list
          const sameHeadingIdIndex = data.headingMeta.headings.findIndex(h => h.id == heading.id);

          // no need to iterate on depth 1 headings
          if (sameHeadingIdIndex !== -1 && heading.depth > 1) {
            const oldHeading = data.headingMeta.headings[sameHeadingIdIndex];
            let lowerDepthHeadingIndex = -1;
          
            for (let i = data.headingMeta.headings.length - 1; i >= 0; i--) {
              if (data.headingMeta.headings[i].depth === oldHeading.depth - 1) {
                lowerDepthHeadingIndex = i;
                break;
              }
            }
          
            // prepend lower heading id
            if (lowerDepthHeadingIndex) {
              heading.id = slugger.slug(`${data.headingMeta.headings[lowerDepthHeadingIndex].id}-${heading.id}`);
            }
          }
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
