// should be used on server
'use no memo'

import type { ReactElement, ReactNode } from 'react'
import { Children, cloneElement } from 'react'

type TOCElement = ReactElement | string

function hasProps(node: ReactNode) {
  return !!node && typeof node === 'object'
}

export function removeLinks(node: ReactNode): TOCElement[] | string {
  if (typeof node === 'string') {
    return node
  }
  // @ts-expect-error fixme
  return Children.map(node, child => {
    if (
      hasProps(child) &&
      // @ts-expect-error -- fixme
      child.props.href
    ) {
      // Skip footnotes links
      // @ts-expect-error -- fixme
      if (child.props['data-footnote-ref']) {
        return
      }
      // @ts-expect-error -- fixme
      child = child.props.children
    }

    if (typeof child === 'string') {
      return child
    }

    if (Array.isArray(child)) {
      return removeLinks(child)
    }
    if (!hasProps(child)) {
      return child
    }
    // @ts-expect-error -- fixme
    const children = removeLinks(child.props.children)
    // @ts-expect-error -- fixme
    return cloneElement(child, { children })
  })
}
