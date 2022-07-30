import React from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, Transition } from '@headlessui/react'
import { ArrowRightIcon } from 'nextra/icons'

import renderComponent from './utils/render-component'
import { getFSRoute } from './utils/get-fs-route'
import useMenuContext from './utils/menu-context'

import { useConfig } from './config'
import Search from './search'
import Flexsearch from './flexsearch'
import { GitHubIcon, DiscordIcon, XIcon, MenuIcon } from 'nextra/icons'
import { Item, PageItem, MenuItem } from './utils/normalize-pages'

interface NavBarProps {
  isRTL?: boolean | null
  flatDirectories: Item[]
  items: (PageItem | MenuItem)[]
}

const NavbarMenuLink = React.forwardRef((props: any, ref) => {
  let { href, children, ...rest } = props
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  )
})

function NavbarMenu({
  className,
  menu,
  children
}: {
  className?: string
  menu: MenuItem
  children: React.ReactNode
}) {
  const items = menu.items
  const routes = Object.fromEntries(
    (menu.children || []).map(route => [route.name, route])
  )

  return (
    <Menu>
      <Menu.Button
        className={cn(
          className,
          'items-center -ml-2 hidden whitespace-nowrap p-2 no-underline md:inline-flex',
          'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
        )}
      >
        {children}
      </Menu.Button>
      <Transition
        leave="transition"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Menu.Items
          className="menu absolute right-0 z-20 mt-1 max-h-64 min-w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-800 dark:ring-white dark:ring-opacity-20"
        >
          {Object.entries(items || {}).map(([key, item]) => {
            const href =
              item.href || routes[key]?.route || menu.route + '/' + key

            return (
              <Menu.Item key={key}>
                <NavbarMenuLink
                  href={href}
                  className="hidden whitespace-nowrap no-underline md:inline-block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 relative cursor-pointer select-none py-1.5 pl-3 pr-9 w-full"
                  {...(item.newWindow
                    ? {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        'aria-selected': false
                      }
                    : {})}
                >
                  {item.title || key}
                </NavbarMenuLink>
              </Menu.Item>
            )
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default function Navbar({ flatDirectories, items }: NavBarProps) {
  const config = useConfig()
  const { locale = 'en-US', asPath } = useRouter()
  const activeRoute = getFSRoute(asPath, locale)
  const { menu, setMenu } = useMenuContext()

  const bannerKey = config.bannerKey || 'nextra-banner'

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem(${JSON.stringify(
            bannerKey
          )})==='0'){document.body.classList.add('nextra-banner-hidden')}}catch(e){}`
        }}
      />
      {config.banner ? (
        <div className="nextra-banner-container sticky top-0 z-20 flex h-10 items-center bg-neutral-900 pl-10 text-sm text-slate-50  dark:bg-[linear-gradient(1deg,#383838,#212121)] dark:text-white md:relative">
          <div className="mx-auto w-full max-w-[90rem] truncate whitespace-nowrap py-1 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)] text-center font-medium">
            {renderComponent(config.banner, {
              locale
            })}
          </div>
          <button
            className="mr-2 w-8 opacity-80 hover:opacity-100"
            onClick={() => {
              try {
                localStorage.setItem(bannerKey, '0')
              } catch {}
              document.body.classList.add('nextra-banner-hidden')
            }}
          >
            <XIcon className="h4 mx-auto w-4" />
          </button>
        </div>
      ) : null}
      <div
        className={
          'nextra-nav-container sticky top-0 z-20 w-full bg-transparent'
        }
      >
        <div className="nextra-nav-container-blur pointer-events-none absolute h-full w-full bg-white dark:bg-dark" />
        <nav className="left-0 right-0 mx-auto flex h-16 max-w-[90rem] items-center gap-2 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
          <div className="mr-2 flex flex-auto items-center">
            <Link href="/">
              <a className="inline-flex items-center text-current no-underline hover:opacity-75">
                {renderComponent(config.logo, { locale })}
              </a>
            </Link>
          </div>

          <div className="flex-1" />

          {items
            ? items.map(pageOrMenu => {
                if (pageOrMenu.hidden) return null

                if (pageOrMenu.type === 'menu') {
                  const menu = pageOrMenu as MenuItem

                  const isActive =
                    menu.route === activeRoute ||
                    activeRoute.startsWith(menu.route + '/')

                  return (
                    <div
                      className="inline-block relative"
                      key={'menu-' + menu.title}
                    >
                      <NavbarMenu
                        className={cn(
                          'nextra-nav-link',
                          isActive
                            ? 'active subpixel-antialiased text-current'
                            : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                            
                        )}
                        menu={menu}
                      >
                        {menu.title}
                        <ArrowRightIcon
                          height="1em"
                          className={cn(
                            'ml-1 h-[18px] min-w-[18px] rounded-sm p-[2px]',
                            '[&>path]:origin-center [&>path]:transition-transform',
                            '[&>path]:rotate-90'
                          )}
                        />
                      </NavbarMenu>
                    </div>
                  )
                } else {
                  const page = pageOrMenu as PageItem
                  let href = page.href || page.route || '#'

                  // If it's a directory
                  if (page.children) {
                    href =
                      (page.withIndexPage
                        ? page.route
                        : page.firstChildRoute) || href
                  }

                  const isActive =
                    page.route === activeRoute ||
                    activeRoute.startsWith(page.route + '/')

                  return (
                    <Link href={href} key={page.route}>
                      <a
                        className={cn(
                          'nextra-nav-link',
                          '-ml-2 hidden whitespace-nowrap p-2 no-underline md:inline-block',
                          !isActive || page.newWindow
                            ? 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                            : 'active subpixel-antialiased text-current'
                        )}
                        {...(page.newWindow
                          ? {
                              target: '_blank',
                              rel: 'noopener noreferrer',
                              'aria-selected': false
                            }
                          : {
                              'aria-selected': isActive
                            })}
                      >
                        {page.title}
                      </a>
                    </Link>
                  )
                }
              })
            : null}

          <div>
            <div className="hidden md:inline-block">
              {config.customSearch ||
                (config.search ? (
                  config.unstable_flexsearch ? (
                    <Flexsearch />
                  ) : (
                    <Search directories={flatDirectories} />
                  )
                ) : null)}
            </div>
          </div>

          {config.projectLink || config.github ? (
            <a
              className="p-2 text-current"
              href={config.projectLink || config.github}
              target="_blank"
              rel="noreferrer"
            >
              {config.projectLinkIcon ? (
                renderComponent(config.projectLinkIcon, { locale })
              ) : (
                <>
                  <GitHubIcon />
                  <span className="sr-only">GitHub</span>
                </>
              )}
            </a>
          ) : null}
          {config.projectChatLink ? (
            <a
              className="p-2 text-current"
              href={config.projectChatLink}
              target="_blank"
              rel="noreferrer"
            >
              {config.projectChatLinkIcon ? (
                renderComponent(config.projectChatLinkIcon, { locale })
              ) : (
                <>
                  <DiscordIcon />
                  <span className="sr-only">Discord</span>
                </>
              )}
            </a>
          ) : null}

          <button
            className="nextra-menu-icon block p-2 -mr-2 md:hidden"
            onClick={() => setMenu(!menu)}
          >
            <MenuIcon className={cn({ open: menu })} />
          </button>
        </nav>
      </div>
    </>
  )
}
