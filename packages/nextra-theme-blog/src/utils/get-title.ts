import React from 'react'

export default function getTitle(
  content: React.ReactElement
): [null | React.ReactElement, React.ReactElement[]] {
  if (content.type === 'h1') return [content, []]
  const children = content.props.children
  const nodes = React.Children.toArray(children) as React.ReactElement[]
  const titleEl = nodes.find(child => child.type === 'h1')
  return [
    titleEl || null,
    nodes.filter(node => node !== titleEl) as React.ReactElement[]
  ]
}
