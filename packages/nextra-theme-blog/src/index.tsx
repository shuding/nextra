import React, { ReactElement, ReactNode, FC } from 'react'
import { ThemeProvider } from 'next-themes'
import type { PageOpts } from 'nextra'
import type { LayoutProps, NextraBlogTheme } from './types'
import { BlogProvider } from './blog-context'
import { ArticleLayout } from './article-layout'
import { PostsLayout } from './posts-layout'
import { PageLayout } from './page-layout'
import { DEFAULT_THEME } from './constants'
import { useRouter } from 'next/router'

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
  const type = opts.frontMatter.type || 'post'
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

const nextraPageContext: {
  [key: string]: {
    Content: FC
    pageOpts: PageOpts
    themeConfig: NextraBlogTheme
  }
} = {}

function Layout(props: any) {
  const { route } = useRouter()
  const context = nextraPageContext[route]
  if (!context) throw new Error(`No content found for ${route}.`)

  const extendedConfig = { ...DEFAULT_THEME, ...context.themeConfig }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BlogLayout config={extendedConfig} opts={context.pageOpts}>
        <context.Content {...props} />
      </BlogLayout>
    </ThemeProvider>
  )
}

// Make sure the same component is always returned so Next.js will render the
// stable layout. We then put the actual content into a global store and use
// the route to identify it.
export default function withLayout(
  route: string,
  Content: FC,
  pageOpts: PageOpts,
  themeConfig: NextraBlogTheme
) {
  nextraPageContext[route] = {
    Content,
    pageOpts,
    themeConfig
  }

  return Layout
}

export { useTheme } from 'next-themes'
export { useBlogContext } from './blog-context'
export * from './types'
