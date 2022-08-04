import React, { ReactNode } from 'react'
import Meta from './meta'
import { useBlogContext } from './blog-context'
import { BasicLayout } from './basic-layout'
import { getParent } from './utils/parent'

export const ArticleLayout = ({ children }: { children: ReactNode }) => {
  const { opts, config } = useBlogContext()
  const { back } = getParent({ opts, config })
  return (
    <BasicLayout>
      <Meta {...opts.meta} back={back} config={config} />
      {children}
      {config.postFooter}
      {config.comments}
    </BasicLayout>
  )
}
