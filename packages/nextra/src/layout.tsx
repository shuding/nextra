import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { NEXTRA_INTERNAL } from './constants'
import { SSGContext } from './data'
import type { NextraInternalGlobal } from './types'

export default function Nextra({
  __nextra_pageMap,
  __nextra_dynamic_opts,
  ...props
}: any): ReactElement {
  const __nextra_internal__ = (globalThis as NextraInternalGlobal)[
    NEXTRA_INTERNAL
  ]
  const { Layout, themeConfig } = __nextra_internal__
  const { route } = useRouter()
  console.log({ route })

  const pageContext = __nextra_internal__.context[route]

  if (!pageContext) {
    throw new Error(
      'No content found for the current route. This is a Nextra bug.'
    )
  }

  let { pageOpts } = pageContext
  const { Content } = pageContext

  if (__nextra_pageMap) {
    pageOpts = {
      ...pageOpts,
      pageMap: __nextra_pageMap
    }
  }

  if (__nextra_dynamic_opts) {
    const { headings, title, frontMatter } = JSON.parse(__nextra_dynamic_opts)
    pageOpts = {
      ...pageOpts,
      headings,
      title,
      frontMatter
    }
  }
  return (
    <Layout themeConfig={themeConfig} pageOpts={pageOpts} pageProps={props}>
      <SSGContext.Provider value={props}>
        <Content />
      </SSGContext.Provider>
    </Layout>
  )
}
