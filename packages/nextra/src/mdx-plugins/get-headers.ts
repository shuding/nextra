import { Processor } from '@mdx-js/mdx/lib/core'
import { Root, Heading, Parent } from 'mdast'

export interface HeadingMeta {
  titleText?: string
  hasH1: boolean
  headings: Heading[]
}

function isHeading(node: any): node is Heading {
  return node.type === 'heading'
}

function visit(node: any, handler: (node: Heading) => any) {
  if (isHeading(node)) {
    handler(node)
  }
  if (node.children) {
    node.children.forEach((n: any) => visit(n, handler))
  }
}
function getFlattenedValue(node: Parent): string {
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

export default function remarkHeadings(this: Processor, headers: Heading[]) {
  const data = this.data() as any
  return (tree: Root, _file: any, done: () => void) => {
    visit(tree, node => {
      const heading = {
        ...node,
        value: getFlattenedValue(node)
      }
      const headingMeta = data.headingMeta as HeadingMeta
      headingMeta.headings.push(heading)
    })
    done()
  }
}
