'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactElement } from 'react'
import { useThemeConfig } from './contexts'

export function Nav(): ReactElement[] {
  const { navs = [] } = useThemeConfig()
  const pathname = usePathname()

  return navs?.map(nav =>
    nav.url === pathname ? (
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
  )
}
