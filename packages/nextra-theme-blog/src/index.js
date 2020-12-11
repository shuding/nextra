import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Meta from './meta'
import Nav from './nav'
import MDXTheme from './mdx-theme'

import traverse from './utils/traverse'
import getTitle from './utils/get-title'
import getTags from './utils/get-tags'
import sortDate from './utils/sort-date'

const Layout = ({
  config,
  meta,
  navPages,
  postList,
  back,
  title,
  children
}) => {
  const [titleNode, contentNodes] = getTitle(children)
  const type = meta.type || 'post'

  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        {config.head || null}
      </Head>
      <article className="container prose prose-sm md:prose">
        {titleNode}
        {type === 'post' ? (
          <Meta {...meta} back={back} config={config} />
        ) : (
          <Nav navPages={navPages} />
        )}
        <MDXTheme>
          {contentNodes}
          {type === 'post' ? config.postFooter : null}
        </MDXTheme>
        {postList}

        {config.footer}
      </article>
    </React.Fragment>
  )
}

export default (opts, _config) => {
  const config = Object.assign(
    {
      readMore: 'Read More →',
      footer: (
        <small style={{ display: 'block', marginTop: '8rem' }}>
          CC BY-NC 4.0 2020 © Shu Ding.
        </small>
      ),
      postFooter: null
    },
    _config
  )

  // gather info for tag/posts pages
  let posts = null
  let navPages = []
  const type = opts.meta.type || 'post'
  const route = opts.route

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

  // back button
  let back = null
  if (type !== 'post') {
    back = null
  } else {
    const parentPages = []
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

  return props => {
    const router = useRouter()
    const { query } = router

    const type = opts.meta.type || 'post'
    const tagName = type === 'tag' ? query.tag : null

    const [titleNode] = getTitle(props.children)
    const title =
      opts.meta.title ||
      (typeof tagName === 'undefined'
        ? null
        : titleNode
        ? ReactDOMServer.renderToStaticMarkup(titleNode.props.children)
        : null) ||
      ''

    const postList = posts ? (
      <ul>
        {posts.map(post => {
          if (tagName) {
            const tags = getTags(post)
            if (!tags.includes(tagName)) {
              return null
            }
          } else if (type === 'tag') {
            return null
          }

          const postTitle =
            (post.frontMatter ? post.frontMatter.title : null) || post.name
          const postDate = post.frontMatter ? (
            <time className="post-item-date">
              {new Date(post.frontMatter.date).toDateString()}
            </time>
          ) : null
          const postDescription =
            post.frontMatter && post.frontMatter.description ? (
              <p className="post-item-desc">
                {post.frontMatter.description}
                {config.readMore ? (
                  <Link href={post.route}>
                    <a className="post-item-more">{config.readMore}</a>
                  </Link>
                ) : null}
              </p>
            ) : null

          return (
            <div key={post.route} className="post-item">
              <h3>
                <Link href={post.route}>
                  <a className="post-item-title">{postTitle}</a>
                </Link>
              </h3>
              {postDescription}
              {postDate}
            </div>
          )
        })}
      </ul>
    ) : null

    return (
      <Layout
        config={config}
        postList={postList}
        navPages={navPages}
        back={back}
        title={title}
        {...opts}
        {...props}
      />
    )
  }
}
