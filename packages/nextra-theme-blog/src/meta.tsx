import Link from 'next/link'
import type { ReactElement } from 'react'
import { GoBack } from './go-back'
import type { BlogFrontMatter } from './types'

export function Meta({
  author,
  tags,
  date,
  readingTime
}: BlogFrontMatter): ReactElement {
  const tagsEl = tags?.map(t => (
    <Link
      key={t}
      href={`/tags/${t}`}
      className={[
        '_select-none _rounded-md _bg-gray-200 _px-1 _text-sm _text-gray-400 _transition-colors',
        'hover:_bg-gray-300 hover:_text-gray-500 dark:_bg-gray-600 dark:_text-gray-300 dark:hover:_bg-gray-700 dark:hover:_text-gray-200'
      ].join(' ')}
    >
      {t}
    </Link>
  ))

  const readingTimeText = readingTime?.text
  const dateObj = date ? new Date(date) : null
  return (
    <div
      className={
        '_mb-8 _flex _gap-3 ' +
        (readingTimeText ? '_items-start' : '_items-center')
      }
    >
      <div className="_grow dark:_text-gray-400 _text-gray-600">
        <div className="_not-prose _flex _flex-wrap _items-center _gap-1">
          {author}
          {author && date && ','}
          {dateObj && (
            <time dateTime={dateObj.toISOString()}>
              {
                // config.dateFormatter?.(dateObj) ||
                dateObj.toDateString()
              }
            </time>
          )}
          {(author || date) && (readingTime || tags?.length) && (
            <span className="_px-1">•</span>
          )}
          {readingTimeText || tagsEl}
        </div>
        {readingTime && (
          <div className="_not-prose _mt-1 _flex _flex-wrap _items-center _gap-1">
            {tagsEl}
          </div>
        )}
      </div>
      <GoBack className="print:_hidden" />
    </div>
  )
}
