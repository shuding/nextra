import { Root, Heading } from 'mdast'

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

export default function getHeaders(headers: Heading[]) {
  return () => (tree: Root, _file: any, done: () => void) => {
    visit(tree, node => {
      const heading = {
        ...node,
        value: node.children.map(child => (child as any).value).join('')
      }
      headers.push(heading)
    })
    done()
  }
}
