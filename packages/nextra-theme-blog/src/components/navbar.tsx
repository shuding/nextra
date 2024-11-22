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
      className="x:mb-8 x:flex x:items-center x:gap-3 x:justify-end"
      data-pagefind-ignore="all"
    >
      {navs?.map(nav =>
        nav.url === pathname ? (
          <span
            key={nav.url}
            className="x:cursor-default x:dark:text-gray-400 x:text-gray-600"
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
