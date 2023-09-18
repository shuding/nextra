import Link from 'next/link'
import type { ReactElement } from 'react'
import { useBlogContext } from './blog-context'
import ThemeSwitch from './theme-switch'
import { split } from './utils/get-tags'
import { getParent } from './utils/parent'

export default function Meta(): ReactElement {
  const { opts, config } = useBlogContext()
  const { author, date, tag } = opts.frontMatter
  const { back } = getParent({ opts, config })
  const tags = tag ? split(tag) : []

  const tagsEl = tags.map(t => (
    <Link
      key={t}
      href={`/tags/${t}`}
      className="
          _select-none
          _rounded-md
          _bg-gray-200
          _px-1
          _text-sm
          _text-gray-400
          _transition-colors
          hover:_bg-gray-300
          hover:_text-gray-500
          dark:_bg-gray-600
          dark:_text-gray-300
          dark:hover:_bg-gray-700
          dark:hover:_text-gray-200
        "
    >
      {t}
    </Link>
  ))

  const readingTime = opts.readingTime?.text
  const dateObj = date ? new Date(date) : null
  return (
    <div
      className={
        '_mb-8 _flex _gap-3 ' + (readingTime ? '_items-start' : '_items-center')
      }
    >
      <div className="_grow dark:_text-gray-400 _text-gray-600">
        <div className="_not-prose _flex _flex-wrap _items-center _gap-1">
          {author}
          {author && date && ','}
          {dateObj && (
            <time dateTime={dateObj.toISOString()}>
              {config.dateFormatter?.(dateObj) || dateObj.toDateString()}
            </time>
          )}
          {(author || date) && (readingTime || tags.length > 0) && (
            <span className="_px-1">•</span>
          )}
          {readingTime || tagsEl}
        </div>
        {readingTime && (
          <div className="_not-prose _mt-1 _flex _flex-wrap _items-center _gap-1">
            {tagsEl}
          </div>
        )}
      </div>
      <div className="_flex _items-center _gap-3 print:_hidden">
        {back && <Link href={back}>Back</Link>}
        {config.darkMode && <ThemeSwitch />}
      </div>
    </div>
  )
}
