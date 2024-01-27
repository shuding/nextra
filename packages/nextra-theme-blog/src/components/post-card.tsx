import Link from 'next/link'
import type { ReactElement } from 'react'
import type { BlogMetadata } from '../types'

type PostCardProps = {
  post: {
    route: string
    frontMatter: BlogMetadata
  }
  readMore?: string
}

export function PostCard({
  post,
  readMore = 'Read More →'
}: PostCardProps): ReactElement {
  const { description, date, title } = post.frontMatter
  const dateObj = date && new Date(date)
  return (
    <div key={post.route} className="post-item">
      <h3>
        <Link href={post.route} className="!_no-underline">
          {title}
        </Link>
      </h3>
      {description && (
        <p className="_mb-2 dark:_text-gray-400 _text-gray-600">
          {description}
          {readMore && (
            <Link href={post.route} className="post-item-more _ml-2">
              {readMore}
            </Link>
          )}
        </p>
      )}
      {dateObj && (
        <time
          className="_text-sm dark:_text-gray-400 _text-gray-600"
          dateTime={dateObj.toISOString()}
        >
          {dateObj.toDateString()}
        </time>
      )}
    </div>
  )
}
