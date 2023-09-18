import { Menu, Transition } from '@headlessui/react'
import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import { useFSRoute } from 'nextra/hooks'
import { ArrowRightIcon, MenuIcon } from 'nextra/icons'
import type { MenuItem, PageItem } from 'nextra/normalize-pages'
import type { ReactElement, ReactNode } from 'react'
import { useConfig, useMenu } from '../contexts'
import { renderComponent } from '../utils'
import { Anchor } from './anchor'

export type NavBarProps = {
  items: (PageItem | MenuItem)[]
}

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
    <div className="_relative _inline-block">
      <Menu>
        <Menu.Button
          className={cn(
            className,
            '-_ml-2 _hidden _items-center _whitespace-nowrap _rounded _p-2 md:_inline-flex',
            classes.inactive
          )}
        >
          {children}
        </Menu.Button>
        <Transition
          leave="_transition-opacity"
          leaveFrom="_opacity-100"
          leaveTo="_opacity-0"
        >
          <Menu.Items
            className="_absolute _right-0 _z-20 _mt-1 _max-h-64 _min-w-full _overflow-auto _rounded-md _ring-1 _ring-black/5 _bg-white _py-1 _text-sm _shadow-lg dark:_ring-white/20 dark:_bg-neutral-800"
            tabIndex={0}
          >
            {Object.entries(items || {}).map(([key, item]) => (
              <Menu.Item key={key}>
                <Anchor
                  href={
                    item.href || routes[key]?.route || menu.route + '/' + key
                  }
                  className={cn(
                    '_relative _hidden _w-full _select-none _whitespace-nowrap _text-gray-600 hover:_text-gray-900 dark:_text-gray-400 dark:hover:_text-gray-100 md:_inline-block',
                    '_py-1.5 _transition-colors ltr:_pl-3 ltr:_pr-9 rtl:_pr-3 rtl:_pl-9'
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

export function Navbar({ items }: NavBarProps): ReactElement {
  const config = useConfig()
  const activeRoute = useFSRoute()
  const { menu, setMenu } = useMenu()

  return (
    <div className="nextra-nav-container nx-sticky nx-top-0 nx-z-20 nx-w-full nx-bg-transparent print:nx-hidden">
      <div
        className={cn(
          'nextra-nav-container-blur',
          'nx-pointer-events-none nx-absolute nx-z-[-1] nx-h-full nx-w-full nx-bg-white dark:nx-bg-dark',
          'nx-shadow-[0_2px_4px_rgba(0,0,0,.02),0_1px_0_rgba(0,0,0,.06)] dark:nx-shadow-[0_-1px_0_rgba(255,255,255,.1)_inset]',
          'contrast-more:nx-shadow-[0_0_0_1px_#000] contrast-more:dark:nx-shadow-[0_0_0_1px_#fff]'
        )}
      />
      <nav className="nx-mx-auto nx-flex nx-h-[var(--nextra-navbar-height)] nx-max-w-[90rem] nx-items-center nx-justify-end nx-gap-2 nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]">
        {config.logoLink ? (
          <NextLink
            href={typeof config.logoLink === 'string' ? config.logoLink : '/'}
            className="nx-flex nx-items-center hover:nx-opacity-75 ltr:nx-mr-auto rtl:nx-ml-auto"
          >
            {renderComponent(config.logo)}
          </NextLink>
        ) : (
          <div className="nx-flex nx-items-center ltr:nx-mr-auto rtl:nx-ml-auto">
            {renderComponent(config.logo)}
          </div>
        )}
        {items.map(pageOrMenu => {
          if (pageOrMenu.display === 'hidden') return null

          if (pageOrMenu.type === 'menu') {
            const menu = pageOrMenu as MenuItem
            return (
              <NavbarMenu
                key={menu.title}
                className={cn(
                  classes.link,
                  'nx-flex nx-gap-1',
                  classes.inactive
                )}
                menu={menu}
              >
                {menu.title}
                <ArrowRightIcon
                  className="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5"
                  pathClassName="nx-origin-center nx-transition-transform nx-rotate-90"
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
              key={href}
              className={cn(
                classes.link,
                'nx-relative -nx-ml-2 nx-hidden nx-whitespace-nowrap nx-p-2 md:nx-inline-block',
                !isActive || page.newWindow ? classes.inactive : classes.active
              )}
              newWindow={page.newWindow}
              aria-current={!page.newWindow && isActive}
            >
              <span className="nx-absolute nx-inset-x-0 nx-text-center">
                {page.title}
              </span>
              <span className="nx-invisible nx-font-medium">{page.title}</span>
            </Anchor>
          )
        })}

        {process.env.NEXTRA_SEARCH &&
          renderComponent(config.search.component, {
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
        ) : null}

        {config.chat.link ? (
          <Anchor
            className="nx-p-2 nx-text-current"
            href={config.chat.link}
            newWindow
          >
            {renderComponent(config.chat.icon)}
          </Anchor>
        ) : null}

        {renderComponent(config.navbar.extraContent)}

        <button
          type="button"
          aria-label="Menu"
          className="nextra-hamburger -nx-mr-2 nx-rounded nx-p-2 active:nx-bg-gray-400/20 md:nx-hidden"
          onClick={() => setMenu(!menu)}
        >
          <MenuIcon className={cn({ open: menu })} />
        </button>
      </nav>
    </div>
  )
}
