import {
  MenuItem as _MenuItem,
  Menu,
  MenuButton,
  MenuItems
} from '@headlessui/react'
import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- since we don't need newWindow prop
import NextLink from 'next/link'
import { useFSRoute } from 'nextra/hooks'
import { ArrowRightIcon, MenuIcon } from 'nextra/icons'
import type { MenuItem, PageItem } from 'nextra/normalize-pages'
import type { ReactElement, ReactNode } from 'react'
import { useMenu, useThemeConfig } from '../contexts'
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
  const entries =
    items instanceof Map
      ? Array.from(items.entries())
      : Object.entries(items || {})

  return (
    <Menu>
      <MenuButton
        className={cn(
          classes.link,
          classes.inactive,
          'max-md:_hidden _items-center _whitespace-nowrap _rounded _flex _gap-1.5'
        )}
      >
        {children}
      </MenuButton>
      <MenuItems
        transition
        className={cn(
          'nextra-scrollbar _transition-opacity data-[closed]:_opacity-0 data-[open]:_opacity-100',
          '_border _border-black/5 dark:_border-white/20',
          '_backdrop-blur-lg _bg-[rgb(var(--nextra-bg),.8)]',
          '_z-20 _rounded-md _py-1 _text-sm _shadow-lg',
          // headlessui adds max-height as style, use !important to override
          '!_max-h-[min(calc(100vh-5rem),256px)]'
        )}
        anchor={{ to: 'top end', gap: 10, padding: 16 }}
      >
        {entries.map(([key, item]) => (
          <_MenuItem
            key={key}
            as={Anchor}
            href={item.href || routes[key]?.route || menu.route + '/' + key}
            className={cn(
              '_block hover:_text-gray-900 dark:hover:_text-gray-100',
              '_py-1.5 _transition-colors ltr:_pl-3 ltr:_pr-9 rtl:_pr-3 rtl:_pl-9',
              'data-[focus]:_text-gray-900 data-[focus]:dark:_text-gray-100',
              '_text-gray-600 dark:_text-gray-400'
            )}
            newWindow={item.newWindow}
          >
            {item.title || key}
          </_MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

export function Navbar({ items }: NavBarProps): ReactElement {
  const themeConfig = useThemeConfig()

  const activeRoute = useFSRoute()
  const { menu, setMenu } = useMenu()

  return (
    <div className="nextra-nav-container _sticky _top-0 _z-20 _w-full _bg-transparent print:_hidden">
      <div className="nextra-nav-container-blur" />
      <nav className="_mx-auto _flex _h-[var(--nextra-navbar-height)] _max-w-[90rem] _items-center _justify-end _gap-4 _pl-[max(env(safe-area-inset-left),1.5rem)] _pr-[max(env(safe-area-inset-right),1.5rem)]">
        {themeConfig.logoLink ? (
          <NextLink
            href={
              typeof themeConfig.logoLink === 'string'
                ? themeConfig.logoLink
                : '/'
            }
            className="_flex _items-center hover:_opacity-75 ltr:_mr-auto rtl:_ml-auto"
          >
            {renderComponent(themeConfig.logo)}
          </NextLink>
        ) : (
          <div className="_flex _items-center ltr:_mr-auto rtl:_ml-auto">
            {renderComponent(themeConfig.logo)}
          </div>
        )}
        {items.map(pageOrMenu => {
          if (pageOrMenu.display === 'hidden') return null

          if (pageOrMenu.type === 'menu') {
            const menu = pageOrMenu as MenuItem
            return (
              <NavbarMenu key={menu.title} menu={menu}>
                {menu.title}
                <ArrowRightIcon className="_h-3.5 *:_origin-center *:_transition-transform *:_rotate-90" />
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

        {process.env.NEXTRA_SEARCH &&
          renderComponent(themeConfig.search.component, {
            className: 'max-md:_hidden'
          })}

        {themeConfig.project.link ? (
          <Anchor href={themeConfig.project.link} newWindow>
            {renderComponent(themeConfig.project.icon)}
          </Anchor>
        ) : null}

        {themeConfig.chat.link ? (
          <Anchor href={themeConfig.chat.link} newWindow>
            {renderComponent(themeConfig.chat.icon)}
          </Anchor>
        ) : null}

        {renderComponent(themeConfig.navbar.extraContent)}

        <button
          type="button"
          aria-label="Menu"
          className="nextra-hamburger _rounded active:_bg-gray-400/20 md:_hidden"
          onClick={() => setMenu(!menu)}
        >
          <MenuIcon className={cn({ open: menu })} />
        </button>
      </nav>
    </div>
  )
}
