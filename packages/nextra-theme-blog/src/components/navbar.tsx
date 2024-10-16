'use client'

import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import type { FC, ReactNode } from 'react'

type NavbarProps = {
  navs?: { name: string; url: string }[]
  children?: ReactNode
}

export const Navbar: FC<NavbarProps> = ({ navs, children }) => {
  const pathname = usePathname()

  return (
    <header
      className="_mb-8 _flex _items-center _gap-3 _justify-end"
      data-pagefind-ignore="all"
    >
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
    </header>
  )
}
