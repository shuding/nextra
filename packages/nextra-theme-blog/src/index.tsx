import React, { PropsWithChildren, ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import type { PageOpt } from 'nextra'
import type { LayoutProps, NextraBlogTheme } from './types'
import { BlogProvider } from './blog-context'
import { ArticleLayout } from './article-layout'
import { PostsLayout } from './posts-layout'
import { PageLayout } from './page-layout'

const layoutMap = {
  post: ArticleLayout,
  page: PageLayout,
  posts: PostsLayout,
  tag: PostsLayout
}

const BlogLayout: React.FC<PropsWithChildren<LayoutProps>> = ({
  config,
  children,
  opts
}) => {
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

const createLayout = (opts: PageOpt, _config: NextraBlogTheme) => {
  const config: NextraBlogTheme = Object.assign(
    {
      readMore: 'Read More →',
      footer: (
        <small className="mt-32 block">CC BY-NC 4.0 2022 © Shu Ding.</small>
      ),
      titleSuffix: null,
      postFooter: null
    },
    _config
  )
  const Page = ({ children }: { children: ReactNode }) => children
  const Layout = (page: ReactNode) => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BlogLayout config={config} opts={opts}>
        {page}
      </BlogLayout>
    </ThemeProvider>
  )
  Page.getLayout = Layout
  return Page
}

export { useBlogContext } from './blog-context'
export * from './types'
export default createLayout
