import type { ReactElement } from 'react'
import { Children, cloneElement } from 'react'

type TOCElement = ReactElement | string

function isLink(node: TOCElement): node is ReactElement {
  return typeof node !== 'string' && !!node.props.href
}

export function removeLinks(node: TOCElement): TOCElement[] | string {
  if (typeof node === 'string') {
    return node
  }
  // @ts-expect-error fixme
  return Children.map(node, child => {
    if (isLink(child)) {
      child = child.props.children
    }

    if (typeof child === 'string') {
      return child
    }

    if (Array.isArray(child)) {
      return removeLinks(child)
    }

    const children = removeLinks(child.props.children)

    return cloneElement(child, { children })
  })
}
