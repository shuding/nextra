import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactElement } from 'react'
import { useBlogContext } from './blog-context'
import { ThemeSwitch } from './theme-switch'

export function Nav(): ReactElement {
  const { config } = useBlogContext()
  const pathname = usePathname()

  return (
    <div className="_mb-8 _flex _items-center _gap-3">
      <div className="_flex _grow _flex-wrap _items-center _justify-end _gap-3">
        {config.navs?.map(nav =>
          pathname === nav.url ? (
            <span
              key={nav.url}
              className="_cursor-default dark:_text-gray-400 _text-gray-600"
            >
              {nav.name}
            </span>
          ) : (
            <Link key={nav.url} href={nav.url}>
              {nav.name}
            </Link>
          )
        )}
      </div>
      {config.darkMode && <ThemeSwitch />}
    </div>
  )
}
