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
import { Details, Summary } from 'nextra/components'

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
import { ExpandIcon } from 'nextra/icons'
import { Collapse } from 'nextra/components'
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
  const isOpen =
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
    <Details
      className={cn({ open: isOpen, active })}
      open={isOpen}
      variant="raw"
    >
      <Summary
        variant="raw"
        className={cn(
          'flex-row-reverse items-center',
          active ? classes.active : classes.inactive
        )}
        iconProps={{
          className:
            'rounded-sm hover:bg-gray-800/5 dark:hover:bg-gray-100/5 ltr:mr-2 rtl:ml-2',
          pathClassName: 'stroke-2',
          onClick() {
            if (!(item as Item).withIndexPage) {
              if (active) return
              TreeState[item.route] = !isOpen
              rerender({})
              return
            }
            // If it's focused, we toggle it. Otherwise, always open it.
            if (active) {
              TreeState[item.route] = !isOpen
            } else {
              TreeState[item.route] = true
              setMenu(false)
            }
            rerender({})
          }
        }}
      >
        <Anchor
          href={
            (item as Item).withIndexPage
              ? item.route
              : item.children?.find(child => child.route)?.route
          }
          className={cn(classes.link, 'grow')}
          tabIndex={-1}
        >
          {item.title}
        </Anchor>
      </Summary>
      {item.children && (
        <Menu
          className={cn(classes.border, 'ltr:ml-1 rtl:mr-1')}
          directories={item.children}
          base={item.route}
          anchors={anchors}
        />
      )}
    </Details>
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
}

const emptyHeading: any[] = []

export function Sidebar({
  docsDirectories,
  flatDirectories,
  fullDirectories,
  asPopover = false,
  headings = emptyHeading
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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (menu) {
      document.body.classList.add('overflow-hidden', 'md:overflow-auto')
    } else {
      document.body.classList.remove('overflow-hidden', 'md:overflow-auto')
    }
  }, [menu])

  useEffect(() => {
    const activeElement = containerRef.current?.querySelector('li.active')

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

  const [showSidebar, setSidebar] = useState(true)

  return (
    <aside
      className={cn(
        'nextra-sidebar-container',
        'fixed inset-y-16 z-[15] w-full flex-shrink-0 overflow-y-auto md:sticky',
        'motion-reduce:transform-none',
        asPopover ? 'md:hidden' : 'md:block',
        hasMenu && 'with-menu',
        menu && 'open',
        showSidebar
          ? 'nextra-scrollbar w-full md:w-64'
          : 'no-scrollbar md:w-20 transform-gpu ease-in-out motion-reduce:transition-none transition-all'
      )}
      ref={containerRef}
    >
      <div className="h-full pl-[calc(env(safe-area-inset-left)-1.5rem)] md:h-auto [-webkit-touch-callout:none]">
        <div className="min-h-[calc(100vh-var(--nextra-navbar-height)-var(--nextra-menu-height))] py-4 px-2">
          {menu ? (
            <>
              <div
                className={cn(
                  'sticky top-0 z-[1] -mt-4 py-4 bg-white',
                  'dark:bg-dark shadow-[0_2px_14px_6px_#fff] dark:shadow-[0_2px_14px_6px_#111]'
                )}
              >
                {renderComponent(config.search.component, {
                  directories: flatDirectories
                })}
              </div>
              <Menu
                // The mobile dropdown menu, shows all the directories.
                directories={fullDirectories}
                // Always show the anchor links on mobile (`md`).
                anchors={anchors}
              />
            </>
          ) : (
            <Collapse open={showSidebar} vertical={false}>
              <Menu
                className="hidden md:flex"
                // The sidebar menu, shows only the docs directories.
                directories={docsDirectories}
                // When the viewport size is larger than `md`, hide the anchors in
                // the sidebar when `floatTOC` is enabled.
                anchors={config.toc.float ? [] : anchors}
              />
            </Collapse>
          )}
        </div>

        {hasMenu && (
          <div
            className={cn(
              'sticky bottom-0 bg-white border-t shadow-[0_-12px_16px_#fff]',
              'flex justify-end items-center gap-2',
              'dark:bg-dark dark:border-neutral-800 dark:shadow-[0_-12px_16px_#111]',
              'contrast-more:shadow-none contrast-more:dark:shadow-none contrast-more:border-neutral-400',
              'mx-3', // hide ring on focused sidebar links
              showSidebar
                ? 'h-[var(--nextra-menu-height)]'
                : 'py-4 flex-wrap justify-center'
            )}
          >
            {config.i18n.length > 0 && (
              <LocaleSwitch
                options={config.i18n}
                lite={!showSidebar}
                className={showSidebar ? 'ltr:mr-auto rtl:ml-auto' : ''}
              />
            )}
            {config.darkMode && <ThemeSwitch lite={config.i18n.length > 0} />}
            {config.sidebar.toggleButton && (
              <button
                title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
                className="hidden md:block h-7 rounded-md transition-colors text-gray-600 dark:text-gray-400 px-2 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-primary-100/5 dark:hover:text-gray-50"
                onClick={() => setSidebar(prev => !prev)}
              >
                <ExpandIcon isOpen={showSidebar} />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
