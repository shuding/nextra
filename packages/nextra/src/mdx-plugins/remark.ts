import { Processor } from '@mdx-js/mdx/lib/core'
import { Root, Heading, Parent } from 'mdast'

export interface HeadingMeta {
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

export function remarkHeadings(this: Processor) {
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
          data.headingMeta.headings.push(heading)
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
