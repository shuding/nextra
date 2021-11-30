import React from 'react'
import Link from 'next/link'
import ThemeSwitch from './theme-switch'

export default function Nav({ navPages, config }) {
  return (
    <div className="nav-line">
      {navPages.map(page => {
        if (page.active) {
          return (
            <span key={page.route} className="nav-link">
              {page.frontMatter.title || page.name}
            </span>
          )
        }
        return (
          <Link key={page.route} href={page.route}>
            <a className="nav-link">{page.frontMatter.title || page.name}</a>
          </Link>
        )
      })}
      {config.darkMode && <ThemeSwitch />}
    </div>
  )
}
