import React, { FC, PropsWithChildren, ReactNode } from 'react'

function renderComponent<T>(
  ComponentOrNode: FC<PropsWithChildren<T>> | ReactNode,
  props: PropsWithChildren<T>,
  functionOnly = false
) {
  if (!ComponentOrNode) return null
  if (typeof ComponentOrNode !== 'function') return ComponentOrNode
  if (functionOnly) return ComponentOrNode(props)
  return <ComponentOrNode {...props} />
}

export default renderComponent
