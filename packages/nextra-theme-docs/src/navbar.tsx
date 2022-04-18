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

  const bannerKey = config.bannerKey || 'nextra-banner'

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try {
        if (localStorage.getItem(${JSON.stringify(bannerKey)}) === '0') {
          document.body.classList.add('nextra-banner-hidden')
        }
      } catch (e) {}`
        }}
      />
      {config.banner ? (
        <div className="nextra-banner-container text-sm h-10 sticky top-0 md:relative pl-10 flex items-center text-slate-50 bg-neutral-900 dark:bg-neutral-700 dark:text-white z-20">
          <div className="max-w-[90rem] mx-auto w-full py-1 text-center font-medium pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)] truncate whitespace-nowrap">
            {renderComponent(config.banner, {
              locale
            })}
          </div>
          <button
            className="mr-2 w-8 opacity-80 hover:opacity-100"
            onClick={() => {
              try {
                localStorage.setItem(bannerKey, '0')
              } catch (e) {}
              document.body.classList.add('nextra-banner-hidden')
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mx-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ) : null}
      <div
        className={
          'nextra-nav-container z-20 sticky bg-transparent w-full top-0'
        }
      >
        <div className="nextra-nav-container-blur absolute w-full h-full bg-white dark:bg-dark pointer-events-none" />
        <nav className="flex max-w-[90rem] mx-auto items-center left-0 right-0 h-16 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
          <div className="flex items-center mr-2">
            <Link href="/">
              <a className="no-underline text-current inline-flex items-center hover:opacity-75">
                {renderComponent(config.logo, { locale })}
              </a>
            </Link>
          </div>

          <div className="w-full" />

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
                        'nextra-nav-link',
                        'no-underline whitespace-nowrap mr-4 hidden md:inline-block',
                        isActive ? 'active text-current' : 'text-gray-500'
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
    </>
  )
}
