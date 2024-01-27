'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactElement, ReactNode } from 'react'

type NavbarProps = {
  navs?: {
    name: string
    url: string
  }[]
  children?: ReactNode
}

export function Navbar({ navs, children }: NavbarProps): ReactElement {
  const pathname = usePathname()

  return (
    <div className="_mb-8 _flex _items-center _gap-3 _justify-end">
      {navs?.map(nav =>
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
      )}
      {children}
    </div>
  )
}
