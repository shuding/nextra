'use client'

import { Link } from 'next-view-transitions'
import { PageMapItem } from 'nextra'
import { useFSRoute } from 'nextra/hooks'
import { normalizePages } from 'nextra/normalize-pages'
import { FC, ReactNode, useMemo } from 'react'

type NavbarProps = {
  children?: ReactNode
  pageMap: PageMapItem[]
}

export const Navbar: FC<NavbarProps> = ({ children, pageMap }) => {
  const pathname = useFSRoute()
  const { topLevelNavbarItems } = useMemo(
    () =>
      normalizePages({
        list: pageMap,
        route: pathname
      }),
    [pageMap, pathname]
  )
  return (
    <header
      className="x:mb-8 x:flex x:items-center x:gap-3 x:justify-end"
      data-pagefind-ignore="all"
    >
      {topLevelNavbarItems.map(nav => {
        const url = nav.route
        return url === pathname ? (
          <span
            key={url}
            className="x:cursor-default x:dark:text-gray-400 x:text-gray-600"
          >
            {nav.title}
          </span>
        ) : (
          <Link key={url} href={url}>
            {nav.title}
          </Link>
        )
      })}
      {children}
    </header>
  )
}
