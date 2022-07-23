import React, { ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { ThemeProvider, useTheme } from 'next-themes'
import { ReactCusdis } from 'react-cusdis'
import Meta from './meta'
import Nav from './nav'
import MDXTheme, { HeadingContext } from './mdx-theme'

import traverse from './utils/traverse'
import getTags from './utils/get-tags'
import sortDate from './utils/sort-date'
import type { PageMapItem, PageOpt } from 'nextra'
import type { NextraBlogTheme } from './types'
// comments
const Cusdis = dynamic(
  () => import('react-cusdis').then(mod => mod.ReactCusdis),
  { ssr: false }
) as typeof ReactCusdis

interface LayoutProps {
  config: NextraBlogTheme
  contentNodes: React.ReactNode
  opts: PageOpt
}

const BlogLayout = ({
  config,
  contentNodes,
  opts
}: LayoutProps): ReactElement => {
  // gather info for tag/posts pages
  let posts: PageMapItem[] = []
  let navPages: PageMapItem[] = []
  const type = opts.meta.type || 'post'
  const route = opts.route
  let back: string | null = null
  // This only renders once per page
  if (type === 'posts' || type === 'tag' || type === 'page') {
    posts = []
    // let's get all posts
    traverse(opts.pageMap, page => {
      if (
        page.frontMatter &&
        ['page', 'posts'].includes(page.frontMatter.type)
      ) {
        if (page.route === route) {
          navPages.push({ ...page, active: true })
        } else {
          navPages.push(page)
        }
      }
      if (page.children) return
      if (page.name.startsWith('_')) return
      if (
        type === 'posts' &&
        !page.route.startsWith(route === '/' ? route : route + '/')
      )
        return
      if (
        type !== 'page' &&
        (!page.frontMatter ||
          !page.frontMatter.type ||
          page.frontMatter.type === 'post')
      ) {
        posts.push(page)
      }
    })
    posts = posts.sort(sortDate)
    navPages = navPages.sort(sortDate)
  }
  if (type !== 'post') {
    back = null
  } else {
    const parentPages: PageMapItem[] = []
    traverse(opts.pageMap, page => {
      if (
        route !== page.route &&
        (route + '/').startsWith(page.route === '/' ? '/' : page.route + '/')
      ) {
        parentPages.push(page)
      }
    })
    const parentPage = parentPages
      .reverse()
      .find(page => page.frontMatter && page.frontMatter.type === 'posts')
    if (parentPage) {
      back = parentPage.route
    }
  }
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const tagName = type === 'tag' ? router.query.tag : null

  const postList = posts.map(post => {
    if (tagName) {
      const tags = getTags(post)
      if (!Array.isArray(tagName) && !tags.includes(tagName)) {
        return null
      }
    } else if (type === 'tag') {
      return null
    }

    const postTitle = post.frontMatter?.title || post.name
    const date = post.frontMatter?.date && new Date(post.frontMatter.date)
    const description = post.frontMatter?.description

    return (
      <div key={post.route}>
        <h3>
          <Link href={post.route} passHref>
            <a className="!no-underline">{postTitle}</a>
          </Link>
        </h3>
        {description && (
          <p className="text-gray-400 mb-2">
            {description}
            {config.readMore && (
              <Link href={post.route} passHref>
                <a className="ml-1">{config.readMore}</a>
              </Link>
            )}
          </p>
        )}
        {date && (
          <time className="text-sm text-gray-300" dateTime={date.toISOString()}>
            {date.toDateString()}
          </time>
        )}
      </div>
    )
  })
  const ref = React.useRef<HTMLHeadingElement>(null)
  const pageTitle = opts.meta.title || opts.titleText || ''
  const title = `${pageTitle}${config.titleSuffix || ''}`

  if (config.cusdis && !config.cusdis.appId) {
    console.warn('[cusdis]', '`appId` is required')
  }
  const comments = config.cusdis?.appId && (
    <Cusdis
      lang={config.cusdis.lang}
      style={{ marginTop: '4rem' }}
      attrs={{
        host: config.cusdis.host || 'https://cusdis.com',
        appId: config.cusdis.appId,
        pageId: router.pathname,
        pageTitle,
        theme: theme === 'dark' || resolvedTheme === 'dark' ? 'dark' : 'light'
      }}
    />
  )
  return (
      <article className="container prose prose-sm md:prose dark:prose-dark">
        <Head>
          <title>{title}</title>
          {config.head?.({ title, meta: opts.meta })}
        </Head>
        <HeadingContext.Provider value={ref}>
          {pageTitle && <h1>{pageTitle}</h1>}
          {type === 'post' ? (
            <Meta {...opts.meta} back={back} config={config} />
          ) : (
            <Nav navPages={navPages} config={config} />
          )}
          <MDXTheme>
            {contentNodes}
            {type === 'post' && config.postFooter}
            {type === 'post' && comments}
          </MDXTheme>
          {postList}
          {config.footer}
        </HeadingContext.Provider>
      </article>
  )
}

const createLayout = (opts: PageOpt, _config: NextraBlogTheme) => {
  const config: NextraBlogTheme = Object.assign(
    {
      readMore: 'Read More →',
      footer: (
        <small className="block mt-32">CC BY-NC 4.0 2022 © Shu Ding.</small>
      ),
      titleSuffix: null,
      postFooter: null
    },
    _config
  )

  const Page = ({ children }: { children: React.ReactChildren }) => children
  const Layout = (page: React.ReactChildren) => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BlogLayout config={config} contentNodes={page} opts={opts} />
    </ThemeProvider>
  )
  Page.getLayout = Layout
  return Page
}

export default createLayout
