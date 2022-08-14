import React, { ReactNode } from 'react'
import Meta from './meta'
import MDXTheme from './mdx-theme'
import { useBlogContext } from './blog-context'
import { BasicLayout } from './basic-layout'
import { getParent } from './utils/parent'
import { StaticTitle } from './title'

export const ArticleLayout = ({ children }: { children: ReactNode }) => {
  const { opts, config } = useBlogContext()
  const { back } = getParent({ opts, config })
  return (
    <BasicLayout>
      <StaticTitle />
      <Meta {...opts.meta} back={back} config={config} />
      <MDXTheme>
        {children}
        {config.postFooter}
        {config.comments}
      </MDXTheme>
    </BasicLayout>
  )
}
