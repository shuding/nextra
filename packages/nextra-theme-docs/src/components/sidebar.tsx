import React, { useState, useEffect, useMemo, ReactElement, memo } from 'react'
import cn from 'clsx'
import Slugger from 'github-slugger'
import { useRouter } from 'next/router'
import { Heading } from 'nextra'
import scrollIntoView from 'scroll-into-view-if-needed'

import { MatchSorterSearch } from './match-sorter-search'
import { Flexsearch } from './flexsearch'
import { useConfig, useMenu, useActiveAnchor } from '../contexts'
import {
  Item,
  MenuItem,
  PageItem,
  getFSRoute,
  getHeadingText,
  renderComponent
} from '../utils'
import { LocaleSwitch } from './locale-switch'
import ThemeSwitch from './theme-switch'
import { ArrowRightIcon } from 'nextra/icons'
import { Collapse } from './collapse'
import { Anchor } from './anchor'
import { DEFAULT_LOCALE } from '../constants'

const TreeState: Record<string, boolean> = {}

interface FolderProps {
  item: PageItem | MenuItem | Item
  anchors: string[]
}

const Folder = memo(FolderImpl)

function FolderImpl({ item, anchors }: FolderProps) {
  const { asPath, locale = DEFAULT_LOCALE } = useRouter()
  const routeOriginal = getFSRoute(asPath, locale)
  const [route] = routeOriginal.split('#')
  const active = [route, route + '/'].includes(item.route + '/')
  const activeRouteInside = active || route.startsWith(item.route + '/')

  const { defaultMenuCollapsed, setMenu } = useMenu()
  const open =
    TreeState[item.route] !== undefined
      ? TreeState[item.route]
      : active || activeRouteInside || !defaultMenuCollapsed

  const rerender = useState({})[1]

  useEffect(() => {
    if (activeRouteInside) {
      TreeState[item.route] = true
    }
  }, [activeRouteInside])

  const link = (
    <Anchor
      href={(item as Item).withIndexPage ? item.route : ''}
      className="cursor-pointer !flex gap-2 items-center justify-between [word-break:break-word]"
      onClick={e => {
        const clickedToggleIcon = ['svg', 'path'].includes(
          (e.target as HTMLElement).tagName.toLowerCase()
        )
        if (clickedToggleIcon) {
          e.preventDefault()
        }
        if ((item as Item).withIndexPage) {
          // If it's focused, we toggle it. Otherwise, always open it.
          if (active || clickedToggleIcon) {
            TreeState[item.route] = !open
          } else {
            TreeState[item.route] = true
            setMenu(false)
          }
          rerender({})
          return
        }
        if (active) return
        TreeState[item.route] = !open
        rerender({})
      }}
    >
      {item.title}
      <ArrowRightIcon
        height="1em"
        className={cn(
          'h-[18px] min-w-[18px] rounded-sm p-0.5 hover:bg-gray-800/5 dark:hover:bg-gray-100/5',
          '[&>path]:origin-center [&>path]:transition-transform rtl:[&>path]:-rotate-180',
          open && 'ltr:[&>path]:rotate-90 rtl:[&>path]:rotate-[-270deg]'
        )}
      />
    </Anchor>
  )

  if (item.type === 'menu') {
    const menu = item as MenuItem
    const routes = Object.fromEntries(
      (menu.children || []).map(route => [route.name, route])
    )
    const directories = Object.entries(menu.items || {}).map(([key, item]) => {
      const route = routes[key] || {
        name: key,
        locale: menu.locale,
        route: menu.route + '/' + key
      }
      return {
        ...route,
        ...item
      }
    })

    return (
      <li className={cn({ open, active })}>
        {link}
        <Collapse open={open}>
          <Menu
            submenu
            directories={directories}
            base={item.route}
            anchors={anchors}
          />
        </Collapse>
      </li>
    )
  }

  return (
    <li className={cn({ open, active })}>
      {link}
      <Collapse open={open}>
        {Array.isArray(item.children) ? (
          <Menu
            submenu
            directories={item.children}
            base={item.route}
            anchors={anchors}
          />
        ) : null}
      </Collapse>
    </li>
  )
}

interface SeparatorProps {
  title?: string
  topLevel: boolean
}

function Separator({ title, topLevel }: SeparatorProps): ReactElement {
  // since title can be empty string ''
  const hasTitle = title !== undefined
  const { sidebarSubtitle } = useConfig()
  return (
    <li
      className={cn(
        topLevel ? 'first:mt-1' : 'first:mt-2',
        hasTitle ? 'mt-5 mb-2' : 'my-4',
        'break-words'
      )}
    >
      {hasTitle ? (
        <div className="mx-2 py-1.5 text-sm font-semibold text-gray-900 no-underline dark:text-gray-100">
          {sidebarSubtitle
            ? renderComponent(sidebarSubtitle, { title })
            : title}
        </div>
      ) : (
        <hr className="mx-2 border-t border-gray-200 dark:border-primary-100/10" />
      )}
    </li>
  )
}

interface FileProps {
  item: PageItem | Item
  anchors: string[]
  topLevel: boolean
}

function File({ item, anchors, topLevel }: FileProps): ReactElement {
  const { asPath, locale = DEFAULT_LOCALE } = useRouter()
  const route = getFSRoute(asPath, locale)
  const active = [route, route + '/'].includes(item.route + '/')
  const slugger = new Slugger()
  const activeAnchor = useActiveAnchor()
  const { setMenu } = useMenu()

  if (item.type === 'separator') {
    return <Separator title={item.title} topLevel={topLevel} />
  }

  return (
    <li className={cn({ active })}>
      <Anchor
        href={(item as PageItem).href || item.route}
        newWindow={(item as PageItem).newWindow}
        className="break-words"
        onClick={() => {
          setMenu(false)
        }}
      >
        {item.title}
      </Anchor>
      {active && anchors.length > 0 && (
        <ul>
          {anchors.map((text, i) => {
            const slug = slugger.slug(text)
            return (
              <li key={`a-${slug}`}>
                <a
                  href={`#${slug}`}
                  className={cn(
                    '!flex text-sm w-full [word-break:break-word]',
                    'before:opacity-25 before:mr-2 before:content-["#"]',
                    activeAnchor[slug]?.isActive &&
                      'font-semibold !text-gray-900 dark:!text-white'
                  )}
                  onClick={() => {
                    setMenu(false)
                  }}
                >
                  {text}
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

interface MenuProps {
  directories: PageItem[] | Item[]
  anchors: string[]
  base?: string
  submenu?: boolean
}

function Menu({ directories, anchors, submenu }: MenuProps): ReactElement {
  return (
    <ul>
      {directories.map(item => {
        if (
          item.type === 'menu' ||
          (item.children && (item.children.length || !item.withIndexPage))
        ) {
          return <Folder key={item.name} item={item} anchors={anchors} />
        }
        return (
          <File
            key={item.name}
            item={item}
            anchors={anchors}
            topLevel={!submenu}
          />
        )
      })}
    </ul>
  )
}

interface SideBarProps {
  docsDirectories: PageItem[]
  flatDirectories: Item[]
  fullDirectories: Item[]
  asPopover?: boolean
  headings?: Heading[]
  includePlaceholder: boolean
}

const emptyHeading: any[] = []

export function Sidebar({
  docsDirectories,
  flatDirectories,
  fullDirectories,
  asPopover = false,
  headings = emptyHeading,
  includePlaceholder
}: SideBarProps): ReactElement {
  const config = useConfig()
  const { menu } = useMenu()
  const anchors = useMemo(
    () =>
      headings
        .filter(v => v.children && v.depth === 2 && v.type === 'heading')
        .map(getHeadingText)
        .filter(Boolean),
    [headings]
  )

  useEffect(() => {
    if (menu) {
      document.body.classList.add('overflow-hidden', 'md:overflow-auto')
    } else {
      document.body.classList.remove('overflow-hidden', 'md:overflow-auto')
    }
  }, [menu])

  useEffect(() => {
    const activeElement = document.querySelector('.nextra-sidebar li.active')

    if (activeElement) {
      scrollIntoView(activeElement, {
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: document.querySelector('.nextra-sidebar-container')
      })
    }
  }, [])

  const hasMenu = !!(config.i18n || config.darkMode)

  return (
    <>
      {includePlaceholder && asPopover ? (
        <div className="hidden h-0 w-64 flex-shrink-0 xl:block" />
      ) : null}
      <aside
        className={cn(
          'nextra-sidebar-container nextra-scrollbar fixed top-16 z-[15] h-[calc(100vh-4rem)] w-full flex-shrink-0 self-start overflow-y-auto md:sticky md:w-64',
          asPopover ? 'md:hidden' : 'md:block',
          hasMenu && 'with-menu',
          { open: menu }
        )}
      >
        <div className="nextra-sidebar h-full w-full select-none pl-[calc(env(safe-area-inset-left)-1.5rem)] md:h-auto">
          <div className="min-h-[calc(100vh-4rem-61px)] p-4">
            <div className="nextra-sidebar-search mb-4 block md:hidden">
              {config.customSearch ||
                (config.search ? (
                  config.unstable_flexsearch ? (
                    <Flexsearch />
                  ) : (
                    <MatchSorterSearch directories={flatDirectories} />
                  )
                ) : null)}
            </div>
            <div className="hidden md:block">
              <Menu
                // The sidebar menu, shows only the docs directories.
                directories={docsDirectories}
                // When the viewport size is larger than `md`, hide the anchors in
                // the sidebar when `floatTOC` is enabled.
                anchors={config.floatTOC ? [] : anchors}
              />
            </div>
            <div className="md:hidden">
              <Menu
                // The mobile dropdown menu, shows all the directories.
                directories={fullDirectories}
                // Always show the anchor links on mobile (`md`).
                anchors={anchors}
              />
            </div>
          </div>

          {hasMenu && (
            <div className="nextra-sidebar-menu mx-4 border-t shadow-[0_-12px_16px_white] dark:border-neutral-800 dark:shadow-[0_-12px_16px_#111]">
              <div className="flex gap-1 bg-white py-4 pb-4 dark:bg-dark justify-between">
                {config.i18n ? (
                  <div className="relative">
                    <LocaleSwitch options={config.i18n} />
                  </div>
                ) : null}
                {config.darkMode ? (
                  <div className="relative">
                    <ThemeSwitch lite={!!config.i18n} />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
