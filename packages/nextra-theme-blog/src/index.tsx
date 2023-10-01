import { ThemeProvider } from 'next-themes'
import type { NextraThemeLayoutProps } from 'nextra'
import { MDXProvider } from 'nextra/src/client/mdx'
import { BasicLayout } from './basic-layout'
import { BlogProvider } from './blog-context'
import { DEFAULT_THEME } from './constants'
import { components } from './mdx-theme'
import Meta from './meta'
import Nav from './nav'
import { PostsLayout } from './posts-layout'
import { isValidDate } from './utils/date'

const layoutSet = new Set(['post', 'page', 'posts', 'tag'])

export default function NextraLayout({
  children,
  pageOpts,
  themeConfig
}: NextraThemeLayoutProps) {
  const opts = pageOpts
  const config = { ...DEFAULT_THEME, ...themeConfig }
  const type = opts.frontMatter.type || 'post'
  const { date } = opts.frontMatter

  if (!layoutSet.has(type)) {
    throw new Error(
      `nextra-theme-blog does not support the layout type "${type}" It only supports "post", "page", "posts" and "tag"`
    )
  }

  if (date && !isValidDate(date)) {
    throw new Error(
      `Invalid date "${date}". Provide date in "YYYY/M/D", "YYYY/M/D H:m", "YYYY-MM-DD", "[YYYY-MM-DD]T[HH:mm]" or "[YYYY-MM-DD]T[HH:mm:ss.SSS]Z" format.`
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BlogProvider value={{ config, opts }}>
        <BasicLayout>
          {type === 'post' ? <Meta /> : <Nav />}
          <MDXProvider
            components={{
              ...components,
              ...config.components
            }}
          >
            {children}
          </MDXProvider>
          {(() => {
            switch (type) {
              case 'post':
                return (
                  <>
                    {config.postFooter}
                    {config.comments}
                  </>
                )
              case 'posts':
              case 'tag':
                return <PostsLayout />
            }
          })()}
        </BasicLayout>
      </BlogProvider>
    </ThemeProvider>
  )
}

export { useTheme } from 'next-themes'
export { useBlogContext } from './blog-context'
export { getStaticTags } from './utils/get-tags'
export * from './types'
