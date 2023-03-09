import type { ReactNode } from 'react'
import Meta from './meta'
import { MDXTheme } from './mdx-theme'
import { useBlogContext } from './blog-context'
import { BasicLayout } from './basic-layout'
import Comments from './cusdis'

export const ArticleLayout = ({ children }: { children: ReactNode }) => {
  const { config } = useBlogContext()
  return (
    <BasicLayout>
      <Meta />
      <MDXTheme>
        {children}
        {config.postFooter}
        <Comments />
      </MDXTheme>
    </BasicLayout>
  )
}
