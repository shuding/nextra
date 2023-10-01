import { ThemeProvider } from 'next-themes'
import type { NextraThemeLayoutProps } from 'nextra'
import type { ReactElement, ReactNode } from 'react'
import { ArticleLayout } from './article-layout'
import { BlogProvider } from './blog-context'
import { DEFAULT_THEME } from './constants'
import { PageLayout } from './page-layout'
import { PostsLayout } from './posts-layout'
import type { LayoutProps } from './types'

const layoutMap = {
  post: ArticleLayout,
  page: PageLayout,
  posts: PostsLayout,
  tag: PostsLayout
}

export default function NextraLayout({
  children,
  pageOpts,
  themeConfig
}: NextraThemeLayoutProps) {
  const opts = pageOpts
  const extendedConfig = { ...DEFAULT_THEME, ...themeConfig }
  const type = opts.frontMatter.type || 'post'
  const Layout = layoutMap[type]
  if (!Layout) {
    throw new Error(
      `nextra-theme-blog does not support the layout type "${type}" It only supports "post", "page", "posts" and "tag"`
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BlogProvider config={extendedConfig} opts={opts}>
        <Layout>{children}</Layout>
      </BlogProvider>
    </ThemeProvider>
  )
}

export { useTheme } from 'next-themes'
export { useBlogContext } from './blog-context'
export { getStaticTags } from './utils/get-tags'
export * from './types'
