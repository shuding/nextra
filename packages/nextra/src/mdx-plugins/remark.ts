import { Processor } from '@mdx-js/mdx/lib/core'
import { Root, Heading, Parent } from 'mdast'

export interface HeadingMeta {
  titleText?: string
  hasH1: boolean
  headings: Heading[]
}

function visit(
  node: any,
  tester: (node: any) => boolean,
  handler: (node: any) => any
) {
  if (tester(node)) {
    handler(node)
  }
  if (node.children) {
    node.children.forEach((n: any) => visit(n, tester, handler))
  }
}

export function getFlattenedValue(node: Parent): string {
  return node.children
    .map(child =>
      'children' in child
        ? getFlattenedValue(child)
        : 'value' in child
        ? child.value
        : ''
    )
    .join('')
}

export default function remarkHeadings(this: Processor) {
  const data = this.data() as any
  return (tree: Root, _file: any, done: () => void) => {
    visit(
      tree,
      node => {
        // Match headings and <details>
        return (
          node.type === 'heading' ||
          node.name === 'summary' ||
          node.name === 'details'
        )
      },
      node => {
        if (node.type === 'heading') {
          const heading = {
            ...(node as Heading),
            value: getFlattenedValue(node)
          }
          const headingMeta = data.headingMeta as HeadingMeta
          if (node.depth === 1) {
            headingMeta.hasH1 = true
            if (Array.isArray(node.children) && node.children.length === 1) {
              const child = node.children[0]
              if (child.type === 'text') {
                headingMeta.titleText = child.value
              }
            }
          }

          headingMeta.headings.push(heading)
        } else if (node.name === 'summary' || node.name === 'details') {
          // Replace the <summary> and <details> with customized components.
          if (node.data) {
            delete node.data._mdxExplicitJsx
          }
        }
      }
    )
    done()
  }
}
