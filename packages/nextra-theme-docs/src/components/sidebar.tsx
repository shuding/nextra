'use client'

import cn from 'clsx'
import { usePathname } from 'next/navigation'
import type { Heading } from 'nextra'
import { Button, renderComponent } from 'nextra/components'
import { useFSRoute } from 'nextra/hooks'
import { ArrowRightIcon, ExpandIcon } from 'nextra/icons'
import type { Item, MenuItem, PageItem } from 'nextra/normalize-pages'
import type { FocusEventHandler, ReactElement } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import {
  useActiveAnchor,
  useConfig,
  useFocusedRoute,
  useFocusedRouteActions,
  useMenu,
  useMenuActions,
  useThemeConfig
} from '../contexts'
import { Anchor } from './anchor'
import { Collapse } from './collapse'
import { LocaleSwitch } from './locale-switch'
import { ThemeSwitch } from './theme-switch'

const TreeState: Record<string, boolean> = Object.create(null)

const classes = {
  link: cn(
    '_flex _rounded _px-2 _py-1.5 _text-sm _transition-colors [word-break:break-word]',
    '_cursor-pointer contrast-more:_border'
  ),
  inactive: cn(
    '_text-gray-500 hover:_bg-gray-100 hover:_text-gray-900',
    'dark:_text-neutral-400 dark:hover:_bg-primary-100/5 dark:hover:_text-gray-50',
    'contrast-more:_text-gray-900 contrast-more:dark:_text-gray-50',
    'contrast-more:_border-transparent contrast-more:hover:_border-gray-900 contrast-more:dark:hover:_border-gray-50'
  ),
  active: cn(
    '_bg-primary-100 _font-semibold _text-primary-800 dark:_bg-primary-400/10 dark:_text-primary-600',
    'contrast-more:_border-primary-500 contrast-more:dark:_border-primary-500'
  ),
  list: cn('_flex _flex-col _gap-1'),
  border: cn(
    '_relative before:_absolute before:_inset-y-1',
    'before:_w-px before:_bg-gray-200 before:_content-[""] dark:before:_bg-neutral-800',
    '_ps-3 before:_start-0'
  ),
  aside: cn(
    'nextra-sidebar-container _flex _flex-col',
    'md:_top-[--nextra-navbar-height] md:_shrink-0 motion-reduce:_transform-none [.resizing_&]:_transition-none',
    '_transform-gpu _transition-all _ease-in-out',
    'print:_hidden'
  ),
  wrapper: cn(
    '_overflow-y-auto',
    '_p-4 _grow md:_h-[calc(100vh-var(--nextra-navbar-height)-var(--nextra-menu-height))]'
  ),
  bottomMenu: cn(
    'nextra-sidebar-footer _sticky _bottom-0',
    '_flex _items-center _gap-2 _py-4',
    '_mx-3 _px-1' // to hide focused sidebar links
  )
}

type FolderProps = {
  item: PageItem | MenuItem | Item
  anchors: Heading[]
  onFocus: FocusEventHandler
  level: number
}

function Folder({ item, anchors, onFocus, level }: FolderProps): ReactElement {
  const routeOriginal = useFSRoute()
  const [route] = routeOriginal.split('#')
  const active = [route, route + '/'].includes(item.route + '/')
  const activeRouteInside = active || route.startsWith(item.route + '/')

  const focusedRoute = useFocusedRoute()
  const focusedRouteInside = focusedRoute.startsWith(item.route + '/')

  const { theme } = item as Item
  const themeConfig = useThemeConfig()

  const open =
    TreeState[item.route] === undefined
      ? active ||
        activeRouteInside ||
        focusedRouteInside ||
        (theme && 'collapsed' in theme
          ? !theme.collapsed
          : level < themeConfig.sidebar.defaultMenuCollapseLevel)
      : TreeState[item.route] || focusedRouteInside

  const rerender = useState({})[1]

  useEffect(() => {
    function updateTreeState() {
      if (activeRouteInside || focusedRouteInside) {
        TreeState[item.route] = true
      }
    }

    function updateAndPruneTreeState() {
      if (activeRouteInside && focusedRouteInside) {
        TreeState[item.route] = true
      } else {
        delete TreeState[item.route]
      }
    }

    if (themeConfig.sidebar.autoCollapse) {
      updateAndPruneTreeState()
    } else {
      updateTreeState()
    }
  }, [
    activeRouteInside,
    focusedRouteInside,
    item.route,
    themeConfig.sidebar.autoCollapse
  ])

  if (item.type === 'menu') {
    const menu = item as MenuItem
    const routes = Object.fromEntries(
      (menu.children || []).map(route => [route.name, route])
    )
    item.children = Object.entries(menu.items || {}).map(([key, item]) => {
      const route = routes[key] || {
        name: key,
        ...('locale' in menu && { locale: menu.locale }),
        route: menu.route + '/' + key
      }
      return {
        ...route,
        ...item
      }
    })
  }

  const isLink = 'withIndexPage' in item && item.withIndexPage
  // use button when link don't have href because it impacts on SEO
  const ComponentToUse = isLink ? Anchor : Button

  return (
    <li className={cn({ open, active })}>
      <ComponentToUse
        href={isLink ? item.route : undefined}
        data-href={isLink ? undefined : item.route}
        className={cn(
          '_items-center _justify-between _gap-2',
          !isLink && '_text-left _w-full',
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
          if (isLink) {
            // If it's focused, we toggle it. Otherwise, always open it.
            if (active || clickedToggleIcon) {
              TreeState[item.route] = !open
            } else {
              TreeState[item.route] = true
            }
            rerender({})
            return
          }
          if (active) return
          TreeState[item.route] = !open
          rerender({})
        }}
        onFocus={onFocus}
      >
        {item.title}
        <ArrowRightIcon
          height="18"
          className={cn(
            '_shrink-0',
            '_rounded-sm _p-0.5 hover:_bg-gray-800/5 dark:hover:_bg-gray-100/5',
            'motion-reduce:*:_transition-none *:_origin-center *:_transition-transform *:rtl:_-rotate-180',
            open && '*:ltr:_rotate-90 *:rtl:_rotate-[-270deg]'
          )}
        />
      </ComponentToUse>
      {Array.isArray(item.children) && (
        <Collapse isOpen={open}>
          <Menu
            className={cn(classes.border, '_pt-1 _ms-3')}
            directories={item.children}
            base={item.route}
            anchors={anchors}
            level={level}
          />
        </Collapse>
      )}
    </li>
  )
}

function Separator({ title }: { title: string }): ReactElement {
  return (
    <li
      className={cn(
        '[word-break:break-word]',
        title
          ? '[&:not(:first-child)]:_mt-5 _mb-2 _px-2 _py-1.5 _text-sm _font-semibold _text-gray-900 dark:_text-gray-100'
          : '_my-4'
      )}
    >
      {title ? (
        renderComponent(title)
      ) : (
        <hr className="_mx-2 _border-t _border-gray-200 dark:_border-primary-100/10" />
      )}
    </li>
  )
}

function File({
  item,
  anchors,
  onFocus
}: {
  item: PageItem | Item
  anchors: Heading[]
  onFocus: FocusEventHandler
}): ReactElement {
  const route = useFSRoute()

  // It is possible that the item doesn't have any route - for example an external link.
  const active = item.route && [route, route + '/'].includes(item.route + '/')
  const { activeAnchor } = useActiveAnchor()
  const { setMenu } = useMenuActions()

  if (item.type === 'separator') {
    return <Separator title={item.title} />
  }

  const handleClick = () => {
    setMenu(false)
  }

  return (
    <li className={cn(classes.list, { active })}>
      <Anchor
        href={(item as PageItem).href || item.route}
        newWindow={(item as PageItem).newWindow}
        className={cn(classes.link, active ? classes.active : classes.inactive)}
        onFocus={onFocus}
      >
        {item.title}
      </Anchor>
      {active && anchors.length > 0 && (
        <ul className={cn(classes.list, classes.border, '_ms-3')}>
          {anchors.map(({ id, value }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cn(
                  classes.link,
                  '_flex _gap-2 before:_opacity-25 before:_content-["#"]',
                  activeAnchor[id]?.isActive ? classes.active : classes.inactive
                )}
                onClick={handleClick}
              >
                {value}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

interface MenuProps {
  directories: PageItem[] | Item[]
  anchors: Heading[]
  base?: string
  className?: string
  onlyCurrentDocs?: boolean
  level: number
}

function Menu({
  directories,
  anchors,
  className,
  onlyCurrentDocs,
  level
}: MenuProps): ReactElement {
  const { setFocused } = useFocusedRouteActions()

  const handleFocus: FocusEventHandler = useCallback(
    event => {
      const route =
        event.target.getAttribute('href') ||
        event.target.getAttribute('data-href') ||
        ''
      setFocused(route)
    },
    [setFocused]
  )

  return (
    <ul className={cn(classes.list, className)}>
      {directories.map(item => {
        if (onlyCurrentDocs && !item.isUnderCurrentDocsTree) return

        const ComponentToUse =
          item.type === 'menu' ||
          (item.children && (item.children.length || !item.withIndexPage))
            ? Folder
            : File

        return (
          <ComponentToUse
            key={item.name}
            item={item}
            anchors={anchors}
            onFocus={handleFocus}
            level={level + 1}
          />
        )
      })}
    </ul>
  )
}

export function MobileNav({ toc }: SidebarProps) {
  const {
    normalizePagesResult: { directories }
  } = useConfig()

  const menu = useMenu()
  const { setMenu } = useMenuActions()

  const pathname = usePathname()

  useEffect(() => {
    setMenu(false)
  }, [pathname, setMenu])

  const anchors = useMemo(() => (toc || []).filter(v => v.depth === 2), [toc])
  const sidebarRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const activeElement = sidebarRef.current.querySelector('li.active')

    if (activeElement && menu) {
      scrollIntoView(activeElement, {
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: sidebarRef.current.parentNode as HTMLElement
      })
    }
  }, [menu])

  const themeConfig = useThemeConfig()
  const hasI18n = themeConfig.i18n.length > 0
  const hasMenu =
    themeConfig.darkMode || hasI18n || themeConfig.sidebar.toggleButton

  return (
    <>
      <div
        className={cn(
          '[transition:background-color_1.5s_ease] max-md:_fixed _inset-0 _z-10',
          menu ? '_bg-black/80 dark:_bg-black/60' : '_bg-transparent'
        )}
      />
      <aside
        className={cn(
          'md:_hidden',
          classes.aside,
          menu
            ? 'max-md:[transform:translate3d(0,0,0)]'
            : 'max-md:[transform:translate3d(0,-100%,0)]'
        )}
      >
        {themeConfig.search && (
          <div className="_px-4 _pt-4 md:_hidden">{themeConfig.search}</div>
        )}
        <div
          className={cn(classes.wrapper, 'nextra-scrollbar')}
          ref={sidebarRef}
        >
          <Menu
            className="nextra-menu-mobile"
            // The mobile dropdown menu, shows all the directories.
            directories={directories}
            // Always show the anchor links on mobile (`md`).
            anchors={anchors}
            level={0}
          />
        </div>

        {hasMenu && (
          <div
            className={cn(
              classes.bottomMenu,
              hasI18n && '_justify-end',
              '_border-t'
            )}
          >
            <LocaleSwitch className="_grow" />
            {themeConfig.darkMode && (
              <ThemeSwitch lite={hasI18n} className={hasI18n ? '' : '_grow'} />
            )}
          </div>
        )}
      </aside>
    </>
  )
}

type SidebarProps = {
  toc: Heading[]
}

export function Sidebar({ toc }: SidebarProps): ReactElement {
  const { normalizePagesResult, hideSidebar: asPopover } = useConfig()
  const { docsDirectories, activeThemeContext } = normalizePagesResult
  const includePlaceholder = activeThemeContext.layout === 'default'

  const [showSidebar, setSidebar] = useState(true)
  const [showToggleAnimation, setToggleAnimation] = useState(false)

  const anchors = useMemo(() => toc.filter(v => v.depth === 2), [toc])
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const activeElement = sidebarRef.current?.querySelector('li.active')

    if (activeElement && window.innerWidth > 767) {
      scrollIntoView(activeElement, {
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: sidebarRef.current!.parentNode as HTMLDivElement
      })
    }
  }, [])

  const themeConfig = useThemeConfig()
  const hasI18n = themeConfig.i18n.length > 0
  const hasMenu =
    themeConfig.darkMode || hasI18n || themeConfig.sidebar.toggleButton

  return (
    <>
      {includePlaceholder && asPopover && (
        <div className="max-xl:_hidden _h-0 _w-64 _shrink-0" />
      )}
      <aside
        className={cn(
          'max-md:_hidden',
          classes.aside,
          showSidebar ? 'md:_w-64' : 'md:_w-20',
          asPopover ? 'md:_hidden' : 'md:_sticky md:_self-start'
        )}
      >
        <div
          className={cn(
            classes.wrapper,
            showSidebar ? 'nextra-scrollbar' : 'no-scrollbar'
          )}
          ref={sidebarRef}
        >
          {/* without asPopover check <Collapse />'s inner.clientWidth on `layout: "raw"` will be 0 and element will not have width on initial loading */}
          {(!asPopover || !showSidebar) && (
            <Collapse isOpen={showSidebar} horizontal>
              <Menu
                className="nextra-menu-desktop"
                // The sidebar menu, shows only the docs directories.
                directories={docsDirectories}
                // When the viewport size is larger than `md`, hide the anchors in
                // the sidebar when `floatTOC` is enabled.
                anchors={themeConfig.toc.float ? [] : anchors}
                onlyCurrentDocs
                level={0}
              />
            </Collapse>
          )}
        </div>

        {hasMenu && (
          <div
            className={cn(
              classes.bottomMenu,
              showSidebar
                ? [hasI18n && '_justify-end', '_border-t']
                : '_py-4 _flex-wrap _justify-center'
            )}
            data-toggle-animation={
              showToggleAnimation ? (showSidebar ? 'show' : 'hide') : 'off'
            }
          >
            <LocaleSwitch
              lite={!showSidebar}
              className={showSidebar ? '_grow' : 'max-md:_grow'}
            />
            {themeConfig.darkMode && (
              <ThemeSwitch
                lite={!showSidebar || hasI18n}
                className={!showSidebar || hasI18n ? '' : '_grow'}
              />
            )}
            {themeConfig.sidebar.toggleButton && (
              <Button
                title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
                className={({ hover }) =>
                  cn(
                    'max-md:_hidden _rounded-md _p-2',
                    hover
                      ? '_bg-gray-100 _text-gray-900 dark:_bg-primary-100/5 dark:_text-gray-50'
                      : '_text-gray-600 dark:_text-gray-400'
                  )
                }
                onClick={() => {
                  setSidebar(!showSidebar)
                  setToggleAnimation(true)
                }}
              >
                <ExpandIcon
                  height="12"
                  className={cn(
                    !showSidebar && 'first:*:_origin-[35%] first:*:_rotate-180'
                  )}
                />
              </Button>
            )}
          </div>
        )}
      </aside>
    </>
  )
}
