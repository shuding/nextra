import Link from 'next/link'
import type { ReactElement } from 'react'
import { useBlogContext } from './blog-context'
import ThemeSwitch from './theme-switch'
import { collectPostsAndNavs } from './utils/collect'

export default function Nav(): ReactElement {
  const { opts, config } = useBlogContext()
  const { navPages } = collectPostsAndNavs({ opts, config })

  return (
    <div className="nx-mb-8 nx-flex nx-items-center nx-gap-3">
      <div className="nx-flex nx-grow nx-flex-wrap nx-items-center nx-justify-end nx-gap-3">
        {navPages.map(page => {
          const name = page.frontMatter?.title || page.name
          if (page.active) {
            return (
              <span
                key={page.route}
                className="nx-cursor-default dark:nx-text-gray-400 nx-text-gray-600"
              >
                {name}
              </span>
            )
          }
          return (
            <Link key={page.route} href={page.route}>
              {name}
            </Link>
          )
        })}
        {config.navs?.map(nav => (
          <Link key={nav.url} href={nav.url}>
            {nav.name}
          </Link>
        ))}
      </div>
      {config.darkMode && <ThemeSwitch />}
    </div>
  )
}
