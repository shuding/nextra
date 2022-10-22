import React, { ReactElement } from 'react'
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
    <Link key={t} href="/tags/[tag]" as={`/tags/${t}`} passHref>
      <a
        className="
          nx-select-none
          nx-rounded-md
          nx-px-1
          nx-transition-colors
          nx-text-sm
          nx-text-gray-400
          hover:nx-text-gray-500
          dark:nx-text-gray-300
          dark:hover:nx-text-gray-200
          nx-bg-gray-200
          hover:nx-bg-gray-300
          dark:nx-bg-gray-600
          dark:hover:nx-bg-gray-700
        "
      >
        {t}
      </a>
    </Link>
  ))

  const readingTime = opts.readingTime?.text

  return (
    <div
      className={
        'nx-mb-8 nx-flex nx-gap-3 ' +
        (readingTime ? 'nx-items-start' : 'nx-items-center')
      }
    >
      <div className="nx-grow nx-text-gray-400">
        <div className="nx-flex nx-flex-wrap nx-items-center nx-gap-1 nx-not-prose">
          {author}
          {author && date && ','}
          {date && (
            <time dateTime={new Date(date).toISOString()}>
              {new Date(date).toDateString()}
            </time>
          )}
          {(author || date) && tags.length > 0 && '  •  '}
          {readingTime || tagsEl}
        </div>
        {readingTime && (
          <div className="nx-flex nx-flex-wrap nx-items-center nx-gap-1 nx-mt-1 nx-not-prose">
            {tagsEl}
          </div>
        )}
      </div>
      <div className="nx-flex nx-items-center nx-gap-3">
        {back && (
          <Link href={back} passHref>
            <a>Back</a>
          </Link>
        )}
        {config.darkMode && <ThemeSwitch />}
      </div>
    </div>
  )
}
