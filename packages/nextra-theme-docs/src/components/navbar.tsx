import React, { ReactElement, ReactNode } from 'react'
import cn from 'clsx'
import { useRouter } from 'next/router'
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
    <div className="nextra-nav-container nx-sticky nx-top-0 nx-z-20 nx-w-full nx-bg-transparent">
      <div
        className={cn(
          'nextra-nav-container-blur',
          'nx-pointer-events-none nx-absolute nx-z-[-1] nx-h-full nx-w-full nx-bg-white dark:nx-bg-dark',
          'nx-shadow-[0_2px_4px_rgba(0,0,0,.02),0_-1px_0_rgba(0,0,0,.06)_inset] dark:nx-shadow-[0_-1px_0_rgba(255,255,255,.1)_inset]',
          'contrast-more:nx-shadow-[0_0_0_1px_#000] contrast-more:dark:nx-shadow-[0_0_0_1px_#fff]'
        )}
      />
      <nav className="nx-mx-auto nx-flex nx-h-[var(--nextra-navbar-height)] nx-max-w-[90rem] nx-items-center nx-justify-end nx-gap-2 nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]">
        {config.logoLink ? (
          <Anchor
            href={typeof config.logoLink === 'string' ? config.logoLink : '/'}
            className="nx-flex ltr:nx-mr-auto rtl:nx-ml-auto nx-items-center hover:nx-opacity-75"
          >
            {renderComponent(config.logo)}
          </Anchor>
        ) : (
          <div className="nx-flex ltr:nx-mr-auto rtl:nx-ml-auto nx-items-center">
            {renderComponent(config.logo)}
          </div>
        )}
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
                  className="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5"
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
                '-nx-ml-2 nx-hidden nx-whitespace-nowrap nx-p-2 md:nx-inline-block',
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
          className: 'nx-hidden md:nx-inline-block mx-min-w-[200px]'
        })}

        {config.project.link ? (
          <Anchor
            className="nx-p-2 nx-text-current"
            href={config.project.link}
            newWindow
          >
            {renderComponent(config.project.icon)}
          </Anchor>
        ) : config.project.icon ? (
          // if no project link is provided, but a component exists, render it
          // to allow the client to render their own link
          renderComponent(config.project.icon)
        ) : null}

        {config.chat.link ? (
          <Anchor
            className="nx-p-2 nx-text-current"
            href={config.chat.link}
            newWindow
          >
            {renderComponent(config.chat.icon)}
          </Anchor>
        ) : config.chat.icon ? (
          // if no chat link is provided, but a component exists, render it
          // to allow the client to render their own link
          renderComponent(config.chat.icon)
        ) : null}

        <button
          className="nextra-hamburger nx-rounded active:nx-bg-gray-400/20 nx-p-2 -nx-mr-2 md:nx-hidden"
          onClick={() => setMenu(!menu)}
        >
          <MenuIcon className={cn({ open: menu })} />
        </button>
      </nav>
    </div>
  )
}
