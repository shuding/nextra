'use client'

import { Menu, Transition } from '@headlessui/react'
import cn from 'clsx'
import { useFSRoute } from 'nextra/hooks'
import { ArrowRightIcon, MenuIcon } from 'nextra/icons'
import type { MenuItem, PageItem } from 'nextra/normalize-pages'
import type { ReactElement, ReactNode } from 'react'
import { useConfig, useMenu, useThemeConfig } from '../../contexts'
import { Anchor } from '../anchor'

const classes = {
  link: cn(
    '_text-sm contrast-more:_text-gray-700 contrast-more:dark:_text-gray-100'
  ),
  active: cn('_font-medium _subpixel-antialiased'),
  inactive: cn(
    '_text-gray-600 hover:_text-gray-800 dark:_text-gray-400 dark:hover:_text-gray-200'
  )
}

function NavbarMenu({
  menu,
  children
}: {
  menu: MenuItem
  children: ReactNode
}): ReactElement {
  const { items } = menu
  const routes = Object.fromEntries(
    (menu.children || []).map(route => [route.name, route])
  )

  return (
    <Menu as="div" className="_relative">
      <Menu.Button
        className={cn(
          classes.link,
          classes.inactive,
          'max-md:_hidden _items-center _whitespace-nowrap _rounded _flex _gap-1'
        )}
      >
        {children}
      </Menu.Button>
      <Transition
        leave="_transition-opacity"
        leaveFrom="_opacity-100"
        leaveTo="_opacity-0"
        as={Menu.Items}
        className="_absolute _right-0 _z-20 _mt-1 _max-h-64 _min-w-full _overflow-auto _rounded-md _ring-1 _ring-black/5 _bg-white _py-1 _text-sm _shadow-lg dark:_ring-white/20 dark:_bg-neutral-800"
      >
        {Object.entries(items || {}).map(([key, item]) => (
          <Menu.Item key={key}>
            {({ active }) => (
              <Anchor
                href={item.href || routes[key]?.route || menu.route + '/' + key}
                className={cn(
                  '_relative _w-full _select-none _whitespace-nowrap hover:_text-gray-900 dark:hover:_text-gray-100 _inline-block',
                  '_py-1.5 _transition-colors ltr:_pl-3 ltr:_pr-9 rtl:_pr-3 rtl:_pl-9',
                  active
                    ? '_text-gray-900 dark:_text-gray-100'
                    : '_text-gray-600 dark:_text-gray-400'
                )}
                newWindow={item.newWindow}
              >
                {item.title || key}
              </Anchor>
            )}
          </Menu.Item>
        ))}
      </Transition>
    </Menu>
  )
}

export type NavbarProps = {
  children?: ReactNode
  project?: ReactNode
  chat?: ReactNode
}

export function ClientNavbar({
  children,
  project,
  chat
}: NavbarProps): ReactElement {
  const items = useConfig().normalizePagesResult.topLevelNavbarItems
  const themeConfig = useThemeConfig()

  const activeRoute = useFSRoute()
  const { menu, setMenu } = useMenu()

  return (
    <>
      {items.map(pageOrMenu => {
        if (pageOrMenu.display === 'hidden') return null

        if (pageOrMenu.type === 'menu') {
          const menu = pageOrMenu as MenuItem
          return (
            <NavbarMenu key={menu.title} menu={menu}>
              {menu.title}
              <ArrowRightIcon
                className="_h-[18px] _min-w-[18px] _rounded-sm _p-0.5"
                pathClassName="_origin-center _transition-transform _rotate-90"
              />
            </NavbarMenu>
          )
        }
        const page = pageOrMenu as PageItem
        let href = page.href || page.route || '#'

        // If it's a directory
        if (page.children) {
          href =
            (page.withIndexPage ? page.route : page.firstChildRoute) || href
        }

        const isActive =
          page.route === activeRoute || activeRoute.startsWith(page.route + '/')

        return (
          <Anchor
            href={href}
            key={href}
            className={cn(
              classes.link,
              'max-md:_hidden _whitespace-nowrap',
              !isActive || page.newWindow ? classes.inactive : classes.active
            )}
            newWindow={page.newWindow}
            aria-current={!page.newWindow && isActive}
          >
            {page.title}
          </Anchor>
        )
      })}
      <div className="max-md:_hidden">{themeConfig.search}</div>

      {project}
      {chat}

      {children}

      <button
        type="button"
        aria-label="Menu"
        className="nextra-hamburger _rounded active:_bg-gray-400/20 md:_hidden"
        onClick={() => setMenu(prev => !prev)}
      >
        <MenuIcon className={cn({ open: menu })} />
      </button>
    </>
  )
}
