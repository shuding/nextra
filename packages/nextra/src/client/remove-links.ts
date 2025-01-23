// should be used on server
'use no memo'

import type { ReactElement, ReactNode, ReactPortal } from 'react'
import { Children, cloneElement } from 'react'

type TOCElement = ReactElement | string

type WithProps = ReactElement | ReactPortal

function isLink(node: ReactNode): node is WithProps {
  return hasProps(node) && !!node.props.href
}

function hasProps(node: ReactNode): node is WithProps {
  return !!node && typeof node === 'object' && 'props' in node
}

export function removeLinks(node: ReactNode): TOCElement[] | string {
  if (typeof node === 'string') {
    return node
  }
  // @ts-expect-error fixme
  return Children.map(node, child => {
    if (isLink(child)) {
      // Skip footnotes links
      if (child.props['data-footnote-ref']) {
        return
      }
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

    const children = removeLinks(child.props.children)

    return cloneElement(child, { children })
  })
}
