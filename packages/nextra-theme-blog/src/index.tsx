import { ThemeProvider } from 'next-themes'
import type { NextraThemeLayoutProps } from 'nextra'
import { ArticleLayout } from './article-layout'
import { BlogProvider } from './blog-context'
import { DEFAULT_THEME } from './constants'
import { PageLayout } from './page-layout'
import { PostsLayout } from './posts-layout'
import { isValidDate } from './utils/date'

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
  const { date } = opts.frontMatter

  if (date && !isValidDate(date)) {
    throw new Error(
      `Invalid date "${date}". Provide date in "YYYY/M/D", "YYYY/M/D H:m", "YYYY-MM-DD", "[YYYY-MM-DD]T[HH:mm]" or "[YYYY-MM-DD]T[HH:mm:ss.SSS]Z" format.`
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BlogProvider value={{ config: extendedConfig, opts }}>
        <Layout>{children}</Layout>
      </BlogProvider>
    </ThemeProvider>
  )
}

export { useTheme } from 'next-themes'
export { useBlogContext } from './blog-context'
export { getStaticTags } from './utils/get-tags'
export * from './types'
