import React, { ReactElement, ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import type { PageOpts } from 'nextra'
import type { LayoutProps, NextraBlogTheme } from './types'
import { BlogProvider } from './blog-context'
import { ArticleLayout } from './article-layout'
import { PostsLayout } from './posts-layout'
import { PageLayout } from './page-layout'
import { DEFAULT_CONFIG } from './constants'

const layoutMap = {
  post: ArticleLayout,
  page: PageLayout,
  posts: PostsLayout,
  tag: PostsLayout
}

const BlogLayout = ({
  config,
  children,
  opts
}: LayoutProps & { children: ReactNode }): ReactElement => {
  const type = opts.meta.type || 'post'
  const Layout = layoutMap[type]
  if (!Layout) {
    throw new Error(
        `Nextra-themes-blog does not support the layout type "${type}" It only supports "post", "page", "posts" and "tag"`
      )
  }
  return (
    <BlogProvider opts={opts} config={config}>
      <Layout>{children}</Layout>
    </BlogProvider>
  )
}

const createLayout = (opts: PageOpts, config: NextraBlogTheme) => {
  const extendedConfig = { ...DEFAULT_CONFIG, ...config }

  const Page = ({ children }: { children: ReactNode }): ReactNode => children
  Page.getLayout = (page: ReactNode): ReactElement => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BlogLayout config={extendedConfig} opts={opts}>
        {page}
      </BlogLayout>
    </ThemeProvider>
  )
  return Page
}

export { useBlogContext } from './blog-context'
export * from './types'
export default createLayout
