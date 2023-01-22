import type { ReactElement } from 'react'
import Link from 'next/link'
import ThemeSwitch from './theme-switch'
import { useBlogContext } from './blog-context'
import { collectPostsAndNavs } from './utils/collect'

export default function Nav(): ReactElement {
  const { opts, config } = useBlogContext()
  const { navPages } = collectPostsAndNavs({ opts, config })
  return (
    <div className="nx-mb-8 nx-flex nx-items-center nx-gap-3">
      <div className="nx-flex nx-grow nx-flex-wrap nx-items-center nx-justify-end nx-gap-3">
        {navPages.map(page => {
          if (page.active) {
            return (
              <span
                key={page.route}
                className="nx-cursor-default nx-text-gray-400"
              >
                {page.frontMatter?.title || page.name}
              </span>
            )
          }
          return (
            <Link key={page.route} href={page.route} passHref legacyBehavior>
              <a>{page.frontMatter?.title || page.name}</a>
            </Link>
          )
        })}
        {config.navs?.map(nav => (
          <Link key={nav.url} href={nav.url} passHref legacyBehavior>
            <a>{nav.name}</a>
          </Link>
        ))}
      </div>
      {config.darkMode && <ThemeSwitch />}
    </div>
  )
}
