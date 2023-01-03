import React from 'react'

import { SSGContext } from './ssg'
import { useInternals } from './use-internals'

export default function Nextra(props: any): React.ReactElement {
  const { context, Layout } = useInternals()
  const { Content } = context

  return React.createElement(
    Layout,
    context,
    React.createElement(
      SSGContext.Provider,
      {
        value: props
      },
      React.createElement(Content, props)
    )
  )
}
