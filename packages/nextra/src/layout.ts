import { ReactElement, createElement } from 'react'

import { SSGContext } from './ssg'
import { useInternals } from './use-internals'

export default function Nextra(props: any): ReactElement {
  const { context, Layout } = useInternals()
  const { Content, ...restContext } = context

  return createElement(
    Layout,
    { ...restContext, pageProps: props },
    createElement(
      SSGContext.Provider,
      { value: props },
      createElement(Content, props)
    )
  )
}
