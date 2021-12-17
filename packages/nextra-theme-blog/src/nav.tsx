import React from 'react'
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
}) {
  return (
    <div className="nav-line">
      {navPages.map(page => {
        if (page.active) {
          return (
            <span key={page.route} className="nav-link">
              {(page.frontMatter && page.frontMatter.title) || page.name}
            </span>
          )
        }
        return (
          <Link key={page.route} href={page.route}>
            <a className="nav-link">
              {(page.frontMatter && page.frontMatter.title) || page.name}
            </a>
          </Link>
        )
      })}
      {config.darkMode && <ThemeSwitch />}
    </div>
  )
}
