import { Link } from 'next-view-transitions'
import type { FC } from 'react'
import type { BlogMetadata } from '../types'

type PostCardProps = {
  post: {
    route: string
    frontMatter: BlogMetadata
  }
  readMore?: string
}

export const PostCard: FC<PostCardProps> = ({
  post,
  readMore = 'Read More →'
}) => {
  const { description, date, title } = post.frontMatter
  const dateObj = date && new Date(date)
  return (
    <div key={post.route}>
      <h2 className="_not-prose _mt-6 _mb-2 _text-xl _font-semibold">
        <Link href={post.route} className="!_no-underline">
          {title}
        </Link>
      </h2>
      {description && (
        <p className="_mb-2 dark:_text-gray-400 _text-gray-600">
          {description}
          {readMore && (
            <Link href={post.route} className="_ml-2">
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
