import type { ReactElement } from 'react'
import Link from 'next/link'
import ThemeSwitch from './theme-switch'
import { split } from './utils/get-tags'
import { useBlogContext } from './blog-context'
import { getParent } from './utils/parent'

export default function Meta(): ReactElement {
  const { opts, config } = useBlogContext()
  const { author, date, tag } = opts.frontMatter
  const { back } = getParent({ opts, config })
  const tags = tag ? split(tag) : []

  const tagsEl = tags.map(t => (
    <Link key={t} href="/tags/[tag]" as={`/tags/${t}`} passHref legacyBehavior>
      <a
        className="
          nx-select-none
          nx-rounded-md
          nx-bg-gray-200
          nx-px-1
          nx-text-sm
          nx-text-gray-400
          nx-transition-colors
          hover:nx-bg-gray-300
          hover:nx-text-gray-500
          dark:nx-bg-gray-600
          dark:nx-text-gray-300
          dark:hover:nx-bg-gray-700
          dark:hover:nx-text-gray-200
        "
      >
        {t}
      </a>
    </Link>
  ))

  const readingTime = opts.readingTime?.text
  const dateObj = date ? new Date(date) : null
  return (
    <div
      className={
        'nx-mb-8 nx-flex nx-gap-3 ' +
        (readingTime ? 'nx-items-start' : 'nx-items-center')
      }
    >
      <div className="nx-grow nx-text-gray-400">
        <div className="nx-not-prose nx-flex nx-flex-wrap nx-items-center nx-gap-1">
          {author}
          {author && date && ','}
          {dateObj && (
            <time dateTime={dateObj.toISOString()}>
              {config.dateFormatter?.(dateObj) || dateObj.toDateString()}
            </time>
          )}
          {(author || date) && (readingTime || tags.length > 0) && (
            <span className="nx-px-1">•</span>
          )}
          {readingTime || tagsEl}
        </div>
        {readingTime && (
          <div className="nx-not-prose nx-mt-1 nx-flex nx-flex-wrap nx-items-center nx-gap-1">
            {tagsEl}
          </div>
        )}
      </div>
      <div className="nx-flex nx-items-center nx-gap-3 print:nx-hidden">
        {back && (
          <Link href={back} passHref legacyBehavior>
            <a>Back</a>
          </Link>
        )}
        {config.darkMode && <ThemeSwitch />}
      </div>
    </div>
  )
}
