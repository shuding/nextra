import React, { ReactElement } from 'react'
import Link from 'next/link'
import ThemeSwitch from './theme-switch'
import type { PageMapItem } from 'nextra'
import { NextraBlogTheme } from './types'

export default function Nav({
  navPages,
  config
}: {
  navPages: PageMapItem[]
  config: NextraBlogTheme
}): ReactElement {
  return (
    <div className="mb-8 flex items-center gap-3">
      <div className="flex grow flex-wrap items-center justify-end gap-3">
        {navPages.map(page => {
          if (page.active) {
            return (
              <span key={page.route} className="cursor-default text-gray-400">
                {page.frontMatter?.title || page.name}
              </span>
            )
          }
          return (
            <Link key={page.route} href={page.route} passHref>
              <a>{page.frontMatter?.title || page.name}</a>
            </Link>
          )
        })}
        {config.navs?.map(nav => (
          <Link key={nav.url} href={nav.url} passHref>
            <a>{nav.name}</a>
          </Link>
        ))}
      </div>
      {config.darkMode && <ThemeSwitch />}
    </div>
  )
}
