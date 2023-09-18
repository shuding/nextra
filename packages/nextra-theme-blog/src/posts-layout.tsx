import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement, ReactNode } from 'react'
import { BasicLayout } from './basic-layout'
import { useBlogContext } from './blog-context'
import { MDXTheme } from './mdx-theme'
import Nav from './nav'
import { collectPostsAndNavs } from './utils/collect'
import getTags from './utils/get-tags'

export function PostsLayout({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { config, opts } = useBlogContext()
  const { posts } = collectPostsAndNavs({ config, opts })
  const router = useRouter()
  const { type } = opts.frontMatter
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
    const date: Date | null = post.frontMatter?.date
      ? new Date(post.frontMatter.date)
      : null
    const description = post.frontMatter?.description

    return (
      <div key={post.route} className="post-item">
        <h3>
          <Link href={post.route} className="!_no-underline">
            {postTitle}
          </Link>
        </h3>
        {description && (
          <p className="_mb-2 dark:_text-gray-400 _text-gray-600">
            {description}
            {config.readMore && (
              <Link href={post.route} className="post-item-more _ml-2">
                {config.readMore}
              </Link>
            )}
          </p>
        )}
        {date && (
          <time
            className="_text-sm dark:_text-gray-400 _text-gray-600"
            dateTime={date.toISOString()}
          >
            {date.toDateString()}
          </time>
        )}
      </div>
    )
  })
  return (
    <BasicLayout>
      <Nav />
      <MDXTheme>{children}</MDXTheme>
      {postList}
    </BasicLayout>
  )
}
