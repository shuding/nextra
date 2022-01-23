import React from 'react'

const renderComponent = <T,>(
  ComponentOrNode: React.FC<T> | React.ReactNode,
  props: T,
  functionOnly?: boolean
) => {
  if (!ComponentOrNode) return null
  if (typeof ComponentOrNode === 'function') {
    if (functionOnly) return ComponentOrNode(props)
    return <ComponentOrNode {...props} />
  }
  return ComponentOrNode
}

export default renderComponent
