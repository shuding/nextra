import React, { ReactElement, ReactNode } from 'react'
import cn from 'clsx'
import { useRouter } from 'next/router.js'
import { Menu, Transition } from '@headlessui/react'
import { ArrowRightIcon } from 'nextra/icons'

import { useConfig, useMenu } from '../contexts'
import { MenuIcon } from 'nextra/icons'
import { Item, PageItem, MenuItem, renderComponent, getFSRoute } from '../utils'
import { Anchor } from './anchor'
import { DEFAULT_LOCALE } from '../constants'

export type NavBarProps = {
  flatDirectories: Item[]
  items: (PageItem | MenuItem)[]
}

const classes = {
  link: 'text-sm contrast-more:text-gray-700 contrast-more:dark:text-gray-100',
  active: 'subpixel-antialiased contrast-more:font-bold',
  inactive:
    'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
}

function NavbarMenu({
  className,
  menu,
  children
}: {
  className?: string
  menu: MenuItem
  children: ReactNode
}): ReactElement {
  const { items } = menu
  const routes = Object.fromEntries(
    (menu.children || []).map(route => [route.name, route])
  )

  return (
    <div className="inline-block relative">
      <Menu>
        <Menu.Button
          className={cn(
            className,
            'rounded items-center -ml-2 hidden whitespace-nowrap p-2 md:inline-flex',
            classes.inactive
          )}
        >
          {children}
        </Menu.Button>
        <Transition
          leave="transition-opacity"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Menu.Items className="absolute right-0 z-20 mt-1 max-h-64 min-w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg dark:bg-neutral-800">
            {Object.entries(items || {}).map(([key, item]) => (
              <Menu.Item key={key}>
                <Anchor
                  href={
                    item.href || routes[key]?.route || menu.route + '/' + key
                  }
                  className={cn(
                    'hidden whitespace-nowrap md:inline-block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 relative select-none w-full',
                    'py-1.5 ltr:pl-3 ltr:pr-9 rtl:pr-3 rtl:pl-9'
                  )}
                  newWindow={item.newWindow}
                >
                  {item.title || key}
                </Anchor>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export function Navbar({ flatDirectories, items }: NavBarProps): ReactElement {
  const config = useConfig()
  const { locale = DEFAULT_LOCALE, asPath } = useRouter()
  const activeRoute = getFSRoute(asPath, locale)
  const { menu, setMenu } = useMenu()

  return (
    <div className="nextra-nav-container sticky top-0 z-20 w-full bg-transparent">
      <div
        className={cn(
          'nextra-nav-container-blur',
          'pointer-events-none absolute z-[-1] h-full w-full bg-white dark:bg-dark',
          'shadow-[0_2px_4px_rgba(0,0,0,.02),0_-1px_0_rgba(0,0,0,.06)_inset] dark:shadow-[0_-1px_0_rgba(255,255,255,.1)_inset]',
          'contrast-more:shadow-[0_0_0_1px_#000] contrast-more:dark:shadow-[0_0_0_1px_#fff]'
        )}
      />
      <nav className="mx-auto flex h-[var(--nextra-navbar-height)] max-w-[90rem] items-center justify-end gap-2 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
        <Anchor
          href="/"
          className="flex ltr:mr-auto rtl:ml-auto items-center hover:opacity-75"
        >
          {renderComponent(config.logo)}
        </Anchor>

        {items.map(pageOrMenu => {
          if (pageOrMenu.hidden) return null

          if (pageOrMenu.type === 'menu') {
            const menu = pageOrMenu as MenuItem

            const isActive =
              menu.route === activeRoute ||
              activeRoute.startsWith(menu.route + '/')

            return (
              <NavbarMenu
                key={menu.title}
                className={cn(
                  classes.link,
                  'flex gap-1',
                  isActive ? classes.active : classes.inactive
                )}
                menu={menu}
              >
                {menu.title}
                <ArrowRightIcon
                  className="h-[18px] min-w-[18px] rounded-sm p-0.5"
                  pathClassName="origin-center transition-transform rotate-90"
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
            page.route === activeRoute ||
            activeRoute.startsWith(page.route + '/')

          return (
            <Anchor
              href={href}
              key={page.route}
              className={cn(
                classes.link,
                '-ml-2 hidden whitespace-nowrap p-2 md:inline-block',
                !isActive || page.newWindow ? classes.inactive : classes.active
              )}
              newWindow={page.newWindow}
              aria-selected={!page.newWindow && isActive}
            >
              {page.title}
            </Anchor>
          )
        })}

        {renderComponent(config.search.component, {
          directories: flatDirectories,
          className: 'hidden md:inline-block min-w-[200px]'
        })}

        {config.project.link ? (
          <Anchor
            className="p-2 text-current"
            href={config.project.link}
            newWindow
          >
            {renderComponent(config.project.icon)}
          </Anchor>
        ) : null}

        {config.chat.link ? (
          <Anchor
            className="p-2 text-current"
            href={config.chat.link}
            newWindow
          >
            {renderComponent(config.chat.icon)}
          </Anchor>
        ) : null}

        <button
          className="nextra-hamburger rounded active:bg-gray-400/20 p-2 -mr-2 md:hidden"
          onClick={() => setMenu(!menu)}
        >
          <MenuIcon className={cn({ open: menu })} />
        </button>
      </nav>
    </div>
  )
}
