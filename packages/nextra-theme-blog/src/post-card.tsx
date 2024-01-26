import Link from 'next/link'
import type { ReactElement } from 'react'
import { ReadMore } from './read-more'

type PostCardProps = {
  post: {
    route: string
    frontMatter: {
      description?: string
      title?: string
      date?: Date
      tags: string[]
    }
  }
}

export function PostCard({ post }: PostCardProps): ReactElement {
  const { description, date, title } = post.frontMatter

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
          <ReadMore route={post.route} />
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
}
