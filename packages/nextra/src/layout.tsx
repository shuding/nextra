import type { ReactElement } from 'react'
import { SSGContext } from './data'
import { useInternals } from './use-internals'

export default function Nextra({
  __nextra_pageMap,
  __nextra_dynamic_opts,
  ...props
}: any): ReactElement {
  const { Layout, themeConfig, Content, pageOpts } = useInternals()

  if (__nextra_pageMap) {
    pageOpts.pageMap = __nextra_pageMap
  }

  if (__nextra_dynamic_opts) {
    const { headings, title, frontMatter } = JSON.parse(__nextra_dynamic_opts)
    Object.assign(pageOpts, {
      headings,
      title,
      frontMatter
    })
  }
  return (
    <Layout themeConfig={themeConfig} pageOpts={pageOpts}>
      <SSGContext.Provider value={props}>
        <Content />
      </SSGContext.Provider>
    </Layout>
  )
}
