import React from 'react'

import { SSGContext } from './ssg'
import { useInternals } from './use-internals'

export default function Nextra({
  __nextra__,
  ...props
}: any): React.ReactElement {
  const { context, Layout } = useInternals()
  const { Content, ...restContext } = context

  if (__nextra__) {
    if (__nextra__.pageMap) {
      restContext.pageOpts = {
        ...restContext.pageOpts,
        pageMap: __nextra__.pageMap
      }
    }
  }

  return React.createElement(
    Layout,
    restContext,
    React.createElement(
      SSGContext.Provider,
      {
        value: props
      },
      React.createElement(Content, props)
    )
  )
}
