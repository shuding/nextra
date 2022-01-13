import React from 'react'

const renderComponent = <T,>(
  ComponentOrNode: React.FC<T> | React.ReactNode,
  props: T
) => {
  if (!ComponentOrNode) return null
  if (typeof ComponentOrNode === 'function') {
    return <ComponentOrNode {...props} />
  }
  return ComponentOrNode
}

export default renderComponent
