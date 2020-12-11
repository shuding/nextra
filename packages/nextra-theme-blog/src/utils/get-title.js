import React from 'react'

export default function getTitle(children) {
  const nodes = React.Children.toArray(children)
  const titleEl = nodes.find(child => child.props.mdxType === 'h1')
  return [titleEl || null, nodes.filter(node => node !== titleEl)]
}
