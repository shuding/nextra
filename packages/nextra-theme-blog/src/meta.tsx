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
    <Link key={t} href="/tags/[tag]" as={`/tags/${t}`}>
      <a
        className="
          select-none
          rounded-md
          px-1
          transition-colors
          text-sm
          text-gray-400
          hover:text-gray-500
          dark:text-gray-300
          dark:hover:text-gray-200
          bg-gray-200
          hover:bg-gray-300
          dark:bg-gray-600
          dark:hover:bg-gray-700
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
        'mb-8 flex gap-3 ' + (readingTime ? 'items-start' : 'items-center')
      }
    >
      <div className="grow text-gray-400">
        <div className="flex flex-wrap items-center gap-1 not-prose">
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
          <div className="flex flex-wrap items-center gap-1 mt-1 not-prose">{tagsEl}</div>
        )}
      </div>
      <div className="flex items-center gap-3">
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
