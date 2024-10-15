import { Link } from 'next-view-transitions'
import type { FC, ReactNode } from 'react'
import type { BlogMetadata } from '../types'
import { GoBack } from './go-back'

export const Meta: FC<BlogMetadata & { children: ReactNode }> = ({
  author,
  tags,
  date,
  readingTime,
  children
}) => {
  const tagsEl = tags?.map(t => (
    <Link key={t} href={`/tags/${t}`} className="nextra-tag">
      {t}
    </Link>
  ))

  const readingTimeText = readingTime?.text

  return (
    <div
      className={
        '_mb-8 _flex _gap-3 ' +
        (readingTimeText ? '_items-start' : '_items-center')
      }
    >
      <div className="_not-prose _grow dark:_text-gray-400 _text-gray-600">
        <div className="_flex _flex-wrap _items-center _gap-1">
          {author}
          {author && date && ','}

          {children}

          {(author || date) && (readingTime || tags?.length) && (
            <span className="_px-1">•</span>
          )}
          {readingTimeText || tagsEl}
        </div>
        {readingTime && (
          <div className="_mt-1 _flex _flex-wrap _items-center _gap-1">
            {tagsEl}
          </div>
        )}
      </div>
      <GoBack />
    </div>
  )
}
