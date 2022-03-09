import React from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

import renderComponent from './utils/render-component'
import { getFSRoute } from './utils/get-fs-route'
import useMenuContext from './utils/menu-context'

import { useConfig } from './config'
import Search from './search'
import Flexsearch from './flexsearch'
import GitHubIcon from './icons/github'
import DiscordIcon from './icons/discord'
import { Item, PageItem } from './utils/normalize-pages'

interface NavBarProps {
  isRTL?: boolean | null
  flatDirectories: Item[]
  items: PageItem[]
}

export default function Navbar({ flatDirectories, items }: NavBarProps) {
  const config = useConfig()
  const { locale, asPath } = useRouter()
  const activeRoute = getFSRoute(asPath, locale)
  const { menu, setMenu } = useMenuContext()

  return (
    <div className="nextra-nav-container z-20 sticky top-0 bg-transparent w-full">
      <div className="nextra-nav-container-blur absolute w-full h-full bg-white dark:bg-dark pointer-events-none" />
      <nav className="flex max-w-[90rem] mx-auto items-center left-0 right-0 h-16 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
        <div className="w-full flex items-center mr-2">
          <Link href="/">
            <a className="no-underline text-current inline-flex items-center hover:opacity-75">
              {renderComponent(config.logo, { locale })}
            </a>
          </Link>
        </div>

        {items
          ? items.map(page => {
              if (page.hidden) return null

              let href = page.href || page.route || '#'

              // If it's a directory
              if (page.children) {
                href =
                  (page.withIndexPage ? page.route : page.firstChildRoute) ||
                  href
              }

              const isActive =
                page.route === activeRoute ||
                activeRoute.startsWith(page.route + '/')

              return (
                <Link href={href} key={page.route}>
                  <a
                    className={cn(
                      'no-underline whitespace-nowrap mr-4 hidden md:inline-block',
                      isActive ? 'text-current' : 'text-gray-500'
                    )}
                    aria-selected={isActive}
                    {...(page.newWindow
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {page.title}
                  </a>
                </Link>
              )
            })
          : null}

        <div className="flex-1">
          <div className="hidden md:inline-block mr-2">
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
            className="text-current p-2"
            href={config.projectLink || config.github}
            target="_blank"
            rel="noreferrer"
          >
            {config.projectLinkIcon ? (
              renderComponent(config.projectLinkIcon, { locale })
            ) : (
              <React.Fragment>
                <GitHubIcon height={24} />
                <span className="sr-only">GitHub</span>
              </React.Fragment>
            )}
          </a>
        ) : null}
        {config.projectChatLink ? (
          <a
            className="text-current p-2"
            href={config.projectChatLink}
            target="_blank"
            rel="noreferrer"
          >
            {config.projectChatLinkIcon ? (
              renderComponent(config.projectChatLinkIcon, { locale })
            ) : (
              <React.Fragment>
                <DiscordIcon height={24} />
                <span className="sr-only">Discord</span>
              </React.Fragment>
            )}
          </a>
        ) : null}

        <button
          className="nextra-menu-icon block md:hidden p-2"
          onClick={() => setMenu(!menu)}
        >
          <svg
            fill="none"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={cn({ open: menu })}
          >
            <g>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16"
              />
            </g>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 12h16"
            />
            <g>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 18h16"
              />
            </g>
          </svg>
        </button>

        <div className="-mr-2" />
      </nav>
    </div>
  )
}
