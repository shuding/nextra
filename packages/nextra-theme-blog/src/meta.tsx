import React, { ReactElement } from 'react'
import Link from 'next/link'
import ThemeSwitch from './theme-switch'
import type { NextraBlogTheme } from './types'
import { split } from './utils/get-tags'

interface MeatProps {
  author: string
  date: string
  tag: string | string[]
  back: string
  config: NextraBlogTheme
}

export default function Meta({
  author,
  date,
  tag,
  back,
  config
}: MeatProps): ReactElement {
  const tags = tag ? split(tag) : []

  return (
    <div className="flex items-center mb-8 gap-3">
      <div className="flex-1 text-gray-400 gap-1 flex items-center flex-wrap">
        {author}
        {author && date && ','}
        {date && (
          <time dateTime={new Date(date).toISOString()}>
            {new Date(date).toDateString()}
          </time>
        )}
        {(author || date) && tags.length > 0 && '•'}
        {tags.map(t => (
          <Link key={t} href="/tags/[tag]" as={`/tags/${t}`}>
            <a
              className="
                px-1
                rounded-md
                text-sm
                leading-5
                bg-gray-200
                select-none
                !no-underline
                !text-gray-400
                dark:!text-gray-100
                hover:!text-gray-800
                dark:hover:!text-gray-800
                dark:bg-gray-400
                active:bg-gray-400
              "
            >
              {t}
            </a>
          </Link>
        ))}
      </div>
      {back && (
        <Link href={back} passHref>
          <a className="text-gray-600">Back</a>
        </Link>
      )}
      {config.darkMode && <ThemeSwitch />}
    </div>
  )
}
