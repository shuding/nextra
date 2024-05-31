import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import type { NextraThemeLayoutProps } from 'nextra'
import { MDXProvider } from 'nextra/mdx'
import { useRef } from 'react'
import { BlogProvider } from './blog-context'
import { DEFAULT_THEME } from './constants'
import { components, HeadingContext } from './mdx-theme'
import Meta from './meta'
import Nav from './nav'
import { PostsLayout } from './posts-layout'
import type { BlogFrontMatter } from './types'
import { isValidDate } from './utils/date'

const layoutSet = new Set(['post', 'page', 'posts', 'tag'])

export default function NextraLayout({
  children,
  pageOpts,
  themeConfig
}: NextraThemeLayoutProps<BlogFrontMatter>) {
  const config = { ...DEFAULT_THEME, ...themeConfig }

  const ref = useRef<HTMLHeadingElement>(null)

  const { title: pageTitle, frontMatter } = pageOpts

  frontMatter.type ||= 'post'

  const { type, date } = frontMatter
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

  const title = `${pageTitle}${config.titleSuffix || ''}`

  const Footer = {
    post: () => (
      <>
        {config.postFooter}
        {config.comments}
      </>
    ),
    posts: PostsLayout,
    tag: PostsLayout,
    page: null
  }[type]

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <title>{title}</title>
        {config.head?.({ title, meta: frontMatter })}
        <style>
          {':root{--nextra-bg:250,250,250;}.dark{--nextra-bg:17,17,17;}'}
        </style>
      </Head>
      <BlogProvider value={{ config, opts: pageOpts }}>
        <article
          className="_container _prose max-md:_prose-sm dark:_prose-dark"
          dir="ltr"
        >
          <HeadingContext.Provider value={ref}>
            {pageOpts.hasJsxInH1 ? <h1 ref={ref} /> : null}
            {pageOpts.hasJsxInH1 ? null : <h1>{pageTitle}</h1>}
            {type === 'post' ? <Meta /> : <Nav />}

            <MDXProvider components={{ ...components, ...config.components }}>
              {children}
            </MDXProvider>

            {Footer && <Footer />}
          </HeadingContext.Provider>

          {config.footer}
        </article>
      </BlogProvider>
    </ThemeProvider>
  )
}

export { useTheme } from 'next-themes'
export { useBlogContext } from './blog-context'
export { getStaticTags } from './utils/get-tags'
export * from './types'
