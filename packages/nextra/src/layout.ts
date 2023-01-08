import React from 'react'

import { SSGContext } from './ssg'
import { useInternals } from './use-internals'

export default function Nextra({
  __nextra_pageMap,
  __nextra_dynamic_opts,
  ...props
}: any): React.ReactElement {
  const { context, Layout } = useInternals()
  const { Content, ...restContext } = context

  if (__nextra_pageMap) {
    restContext.pageOpts = {
      ...restContext.pageOpts,
      pageMap: __nextra_pageMap
    }
  }

  if (__nextra_dynamic_opts) {
    const data = JSON.parse(__nextra_dynamic_opts)
    restContext.pageOpts = {
      ...restContext.pageOpts,
      headings: data.headings,
      title: data.title || restContext.pageOpts.title,
      frontMatter: data.frontMatter
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
