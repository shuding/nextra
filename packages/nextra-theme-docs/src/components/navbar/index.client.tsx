'use client'

import {
  MenuItem as _MenuItem,
  Menu,
  MenuButton,
  MenuItems
} from '@headlessui/react'
import cn from 'clsx'
import { Anchor, Button } from 'nextra/components'
import { useFSRoute } from 'nextra/hooks'
import { ArrowRightIcon, MenuIcon } from 'nextra/icons'
import type { MenuItem } from 'nextra/normalize-pages'
import type { FC, ReactNode } from 'react'
import { setMenu, useConfig, useMenu, useThemeConfig } from '../../stores'


const NavbarMenu: FC<{
  menu: MenuItem
  children: ReactNode
}> = ({ menu, children }) => {
  const routes = Object.fromEntries(
    (menu.children || []).map(route => [route.name, route])
  )
  return (
    <Menu>
      <MenuButton
        className={({ focus }) =>
          cn(
            'nextra-navbar-link nextra-navbar-menu-button',
            focus && 'x:nextra-focus'
          )
        }
      >
        {children}
        <ArrowRightIcon
          height="14"
          className="nextra-navbar-menu-button-icon"
        />
      </MenuButton>
      <MenuItems
        transition
        className={cn(
          'nextra-scrollbar nextra-navbar-menu-items'
        )}
        anchor={{ to: 'bottom', gap: 10, padding: 16 }}
      >
        {Object.entries(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- fixme
          (menu.items as Record<string, { title: string; href?: string }>) || {}
        ).map(([key, item]) => (
          <_MenuItem
            key={key}
            as={Anchor}
            href={item.href || routes[key]?.route}
            className='nextra-navbar-menu-item'
          >
            {item.title}
          </_MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

const isMenu = (page: any): page is MenuItem => page.type === 'menu'

export const ClientNavbar: FC<{
  children: ReactNode
  className?: string
}> = ({ children, className }) => {
  const items = useConfig().normalizePagesResult.topLevelNavbarItems
  const themeConfig = useThemeConfig()

  const pathname = useFSRoute()
  const menu = useMenu()

  return (
    <>
      <div
        className={cn(
          'nextra-navbar-menu',
          className
        )}
      >
        {items.map((page, _index, arr) => {
          if ('display' in page && page.display === 'hidden') return
          if (isMenu(page)) {
            return (
              <NavbarMenu key={page.name} menu={page}>
                {page.title}
              </NavbarMenu>
            )
          }
          const href =
            // If it's a directory
            ('frontMatter' in page ? page.route : page.firstChildRoute) ||
            page.href ||
            page.route

          const isCurrentPage =
            href === pathname ||
            (pathname.startsWith(page.route + '/') &&
              arr.every(item => !('href' in item) || item.href !== pathname)) ||
            undefined

          return (
            <Anchor
              href={href}
              key={page.name}
              className={cn(
                'nextra-navbar-link nextra-navbar-menu-anchor'
              )}
              aria-current={isCurrentPage}
            >
              {page.title}
            </Anchor>
          )
        })}
      </div>
      {themeConfig.search && (
        <div className="x:max-md:hidden">{themeConfig.search}</div>
      )}

      {children}

      <Button
        aria-label="Menu"
        className={({ active }) =>
          cn('nextra-hamburger x:md:hidden', active && 'x:bg-gray-400/20')
        }
        onClick={() => setMenu(prev => !prev)}
      >
        <MenuIcon height="24" className={cn({ open: menu })} />
      </Button>
    </>
  )
}
