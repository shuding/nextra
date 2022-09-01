import React, {
  useState,
  useEffect,
  useMemo,
  ReactElement,
  memo,
  useRef
} from 'react'
import cn from 'clsx'
import Slugger from 'github-slugger'
import { useRouter } from 'next/router'
import { Heading } from 'nextra'
import scrollIntoView from 'scroll-into-view-if-needed'

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

const TreeState: Record<string, boolean> = Object.create(null)

const Folder = memo(FolderImpl)

const classes = {
  link: cn(
    'flex rounded px-2 py-1.5 text-sm transition-colors [word-break:break-word]',
    '[-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border'
  ),
  inactive: cn(
    'hover:bg-gray-100 text-gray-500 hover:text-gray-900',
    'dark:hover:bg-primary-100/5 dark:text-neutral-500 dark:hover:text-gray-50',
    'contrast-more:text-gray-900 contrast-more:dark:text-gray-50',
    'contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50'
  ),
  active: cn(
    'bg-primary-50 text-primary-500 dark:bg-primary-500/10 font-bold',
    'contrast-more:border-primary-500 contrast-more:dark:border-primary-500'
  ),
  list: 'flex gap-1 flex-col',
  border: cn(
    'relative before:absolute before:top-1.5 before:bottom-1.5',
    'before:content-[""] before:w-px before:bg-gray-200 dark:before:bg-neutral-800',
    'ltr:pl-3 rtl:pr-3 ltr:before:left-0 rtl:before:right-0'
  )
}

function FolderImpl({
  item,
  anchors
}: {
  item: PageItem | MenuItem | Item
  anchors: string[]
}): ReactElement {
  const { asPath, locale = DEFAULT_LOCALE } = useRouter()
  const routeOriginal = getFSRoute(asPath, locale)
  const [route] = routeOriginal.split('#')
  const active = [route, route + '/'].includes(item.route + '/')
  const activeRouteInside = active || route.startsWith(item.route + '/')

  const { setMenu } = useMenu()
  const config = useConfig()
  const open =
    TreeState[item.route] !== undefined
      ? TreeState[item.route]
      : active || activeRouteInside || !config.sidebar.defaultMenuCollapsed

  const rerender = useState({})[1]

  useEffect(() => {
    if (activeRouteInside) {
      TreeState[item.route] = true
    }
  }, [activeRouteInside])

  if (item.type === 'menu') {
    const menu = item as MenuItem
    const routes = Object.fromEntries(
      (menu.children || []).map(route => [route.name, route])
    )
    item.children = Object.entries(menu.items || {}).map(([key, item]) => {
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
  }
  return (
    <li className={cn({ open, active })}>
      <Anchor
        href={
          (item as Item).withIndexPage
            ? item.route
            : item.children?.find(child => child.route)?.route
        }
        className={cn(
          'gap-2 items-center justify-between',
          classes.link,
          active ? classes.active : classes.inactive
        )}
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
          className="h-[18px] min-w-[18px] rounded-sm p-0.5 hover:bg-gray-800/5 dark:hover:bg-gray-100/5"
          pathClassName={cn(
            'origin-center transition-transform rtl:-rotate-180',
            open && 'ltr:rotate-90 rtl:rotate-[-270deg]'
          )}
        />
      </Anchor>
      <Collapse open={open}>
        {Array.isArray(item.children) ? (
          <Menu
            className={cn(classes.border, 'ltr:ml-1 rtl:mr-1')}
            directories={item.children}
            base={item.route}
            anchors={anchors}
          />
        ) : null}
      </Collapse>
    </li>
  )
}

function Separator({ title }: { title: string }): ReactElement {
  const config = useConfig()
  return (
    <li
      className={cn(
        '[word-break:break-word]',
        title
          ? 'first:mt-0 mt-5 mb-2 px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100'
          : 'my-4'
      )}
    >
      {title ? (
        renderComponent(config.sidebar.subtitle, { title })
      ) : (
        <hr className="mx-2 border-t border-gray-200 dark:border-primary-100/10" />
      )}
    </li>
  )
}

function File({
  item,
  anchors
}: {
  item: PageItem | Item
  anchors: string[]
}): ReactElement {
  const { asPath, locale = DEFAULT_LOCALE } = useRouter()
  const route = getFSRoute(asPath, locale)
  const active = [route, route + '/'].includes(item.route + '/')
  const slugger = new Slugger()
  const activeAnchor = useActiveAnchor()
  const { setMenu } = useMenu()

  if (item.type === 'separator') {
    return <Separator title={item.title} />
  }

  return (
    <li className={cn(classes.list, { active })}>
      <Anchor
        href={(item as PageItem).href || item.route}
        newWindow={(item as PageItem).newWindow}
        className={cn(classes.link, active ? classes.active : classes.inactive)}
        onClick={() => {
          setMenu(false)
        }}
      >
        {item.title}
      </Anchor>
      {active && anchors.length > 0 && (
        <ul className={cn(classes.list, classes.border, 'ltr:ml-3 rtl:mr-3')}>
          {anchors.map(text => {
            const slug = slugger.slug(text)
            return (
              <li key={slug}>
                <a
                  href={`#${slug}`}
                  className={cn(
                    classes.link,
                    'before:opacity-25 flex gap-2 before:content-["#"]',
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
  className?: string
}

function Menu({ directories, anchors, className }: MenuProps): ReactElement {
  return (
    <ul className={cn(classes.list, className)}>
      {directories.map(item =>
        item.type === 'menu' ||
        (item.children && (item.children.length || !item.withIndexPage)) ? (
          <Folder key={item.name} item={item} anchors={anchors} />
        ) : (
          <File key={item.name} item={item} anchors={anchors} />
        )
      )}
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
  const sidebarRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (menu) {
      document.body.classList.add('overflow-hidden', 'md:overflow-auto')
    } else {
      document.body.classList.remove('overflow-hidden', 'md:overflow-auto')
    }
  }, [menu])

  useEffect(() => {
    const activeElement = sidebarRef.current?.querySelector('li.active')

    if (activeElement) {
      scrollIntoView(activeElement, {
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: containerRef.current
      })
    }
  }, [])

  const hasMenu = !!(config.i18n.length || config.darkMode)

  return (
    <>
      {includePlaceholder && asPopover ? (
        <div className="hidden h-0 w-64 flex-shrink-0 xl:block" />
      ) : null}
      <aside
        className={cn(
          'nextra-sidebar-container nextra-scrollbar',
          'fixed top-16 z-[15] h-[calc(100vh-4rem)] w-full flex-shrink-0 self-start overflow-y-auto md:sticky md:w-64',
          asPopover ? 'md:hidden' : 'md:block',
          '[&::-webkit-scrollbar-track]:mt-[var(--nextra-navbar-height)] md:[&::-webkit-scrollbar-track]:mt-5',
          {
            open: menu,
            '[&::-webkit-scrollbar-track]:mb-[var(--nextra-menu-height)]':
              hasMenu
          }
        )}
        ref={containerRef}
      >
        <div
          className="h-full w-full select-none pl-[calc(env(safe-area-inset-left)-1.5rem)] md:h-auto [-webkit-touch-callout:none]"
          ref={sidebarRef}
        >
          <div className="min-h-[calc(100vh-4rem-61px)] p-4">
            <div
              className={cn(
                'sticky top-0 z-[1] block md:hidden -mt-4 mb-4 bg-white pt-4',
                'dark:bg-dark shadow-[0_2px_14px_6px_#fff] dark:shadow-[0_2px_14px_6px_#111]'
              )}
            >
              {renderComponent(config.search.component, {
                directories: flatDirectories
              })}
            </div>
              <Menu
                className="hidden md:flex"
                // The sidebar menu, shows only the docs directories.
                directories={docsDirectories}
                // When the viewport size is larger than `md`, hide the anchors in
                // the sidebar when `floatTOC` is enabled.
                anchors={config.toc.float ? [] : anchors}
              />
              <Menu
                className="md:hidden"
                // The mobile dropdown menu, shows all the directories.
                directories={fullDirectories}
                // Always show the anchor links on mobile (`md`).
                anchors={anchors}
              />
          </div>

          {hasMenu && (
            <div
              className={cn(
                'sticky bottom-0 mx-4 border-t shadow-[0_-12px_16px_#fff] dark:border-neutral-800 dark:shadow-[0_-12px_16px_#111]',
                'contrast-more:shadow-none contrast-more:dark:shadow-none contrast-more:border-neutral-400',
                'h-[var(--nextra-menu-height)]',
                'flex bg-white dark:bg-dark justify-between items-center',
                'mx-3', // hide ring on focused sidebar links
              )}
            >
              {config.i18n.length > 0 && <LocaleSwitch options={config.i18n} />}
              {config.darkMode && <ThemeSwitch lite={config.i18n.length > 0} />}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
