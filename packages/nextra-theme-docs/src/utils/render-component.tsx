import React, { PropsWithChildren } from 'react'

const renderComponent = <T,>(
  ComponentOrNode: React.FC<PropsWithChildren<T>> | React.ReactNode,
  props: PropsWithChildren<T>,
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
