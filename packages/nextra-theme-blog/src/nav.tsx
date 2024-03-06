import Link from 'next/link'
import type { ReactElement } from 'react'
import { useBlogContext } from './blog-context'
import ThemeSwitch from './theme-switch'
import { collectPostsAndNavs } from './utils/collect'

export default function Nav(): ReactElement {
  const { opts, config } = useBlogContext()
  const { navPages } = collectPostsAndNavs({ opts, config })

  return (
    <div className="_mb-8 _flex _items-center _gap-3">
      <div className="_flex _grow _flex-wrap _items-center _justify-end _gap-3">
        {navPages.map(page => {
          const name = page.frontMatter?.title || page.name
          if (page.active) {
            return (
              <span
                key={page.route}
                className="_cursor-default dark:_text-gray-400 _text-gray-600"
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
