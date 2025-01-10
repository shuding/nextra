import type { PageMapItem } from 'nextra'
import { normalizePages } from 'nextra/normalize-pages'
import type { FC, ReactNode } from 'react'
import { NavbarLink } from './navbar-link'

type NavbarProps = {
  children?: ReactNode
  pageMap: PageMapItem[]
}

export const Navbar: FC<NavbarProps> = ({ children, pageMap }) => {
  const { topLevelNavbarItems } = normalizePages({ list: pageMap, route: '/' })
  return (
    <header
      className="x:mb-8 x:flex x:items-center x:gap-3 x:justify-end"
      data-pagefind-ignore="all"
    >
      {topLevelNavbarItems.map(nav => (
        <NavbarLink key={nav.route} href={nav.route}>
          {nav.title}
        </NavbarLink>
      ))}
      {children}
    </header>
  )
}
