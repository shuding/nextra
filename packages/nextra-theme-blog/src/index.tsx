import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import type { NextraThemeLayoutProps } from 'nextra'
import { MDXProvider } from 'nextra/src/client/mdx'
import { useRef } from 'react'
import { BlogProvider } from './blog-context'
import { DEFAULT_THEME } from './constants'
import { components, HeadingContext } from './mdx-theme'
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
  const ref = useRef<HTMLHeadingElement>(null)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BlogProvider value={{ config, opts }}>
        <article
          className="_container _prose max-md:_prose-sm dark:_prose-dark"
          dir="ltr"
        >
          <MDXProvider
            components={{
              ...components,
              ...config.components,
              wrapper: function NextraWrapper({
                frontMatter,
                title: pageTitle,
                children
              }) {
                const title = `${pageTitle}${config.titleSuffix || ''}`

                const type = frontMatter.type || 'post'
                const { date } = frontMatter

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
                  <HeadingContext.Provider value={ref}>
                    <Head>
                      <title>{title}</title>
                      {config.head?.({ title, meta: frontMatter })}
                    </Head>
                    {opts.hasJsxInH1 ? <h1 ref={ref} /> : null}
                    {opts.hasJsxInH1 ? null : <h1>{opts.title}</h1>}
                    {type === 'post' ? <Meta /> : <Nav />}
                    {children}
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
                  </HeadingContext.Provider>
                )
              }
            }}
          >
            {children}
          </MDXProvider>
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
