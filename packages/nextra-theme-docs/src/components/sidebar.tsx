'use client'

import cn from 'clsx'
import { usePathname } from 'next/navigation'
import type { Heading } from 'nextra'
import { Anchor, Button, Collapse } from 'nextra/components'
import { useFSRoute, useHash } from 'nextra/hooks'
import { ArrowRightIcon, ExpandIcon } from 'nextra/icons'
import type { Item, MenuItem, PageItem } from 'nextra/normalize-pages'
import type {
  ComponentProps,
  FC,
  FocusEventHandler,
  MouseEventHandler,
  ReactNode
} from 'react'
import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import {
  setFocusedRoute,
  setMenu,
  useActiveAnchor,
  useConfig,
  useFocusedRoute,
  useMenu,
  useThemeConfig,
  useTOC
} from '../stores'
import { LocaleSwitch } from './locale-switch'
import { ThemeSwitch } from './theme-switch'

const TreeState: Record<string, boolean> = Object.create(null)

const classes = {
  link: cn(
    'x:flex x:rounded x:px-2 x:py-1.5 x:text-sm x:transition-colors x:[word-break:break-word]',
    'x:cursor-pointer x:contrast-more:border'
  ),
  inactive: cn(
    'x:text-gray-600 x:hover:bg-gray-100 x:hover:text-gray-900',
    'x:dark:text-neutral-400 x:dark:hover:bg-primary-100/5 x:dark:hover:text-gray-50',
    'x:contrast-more:text-gray-900 x:contrast-more:dark:text-gray-50',
    'x:contrast-more:border-transparent x:contrast-more:hover:border-gray-900 x:contrast-more:dark:hover:border-gray-50'
  ),
  active: cn(
    'x:bg-primary-100 x:font-semibold x:text-primary-800 x:dark:bg-primary-400/10 x:dark:text-primary-600',
    'x:contrast-more:border-primary-500!'
  ),
  list: cn('x:grid x:gap-1'),
  border: cn(
    'x:relative x:before:absolute x:before:inset-y-1',
    'x:before:w-px x:before:bg-gray-200 x:before:content-[""] x:dark:before:bg-neutral-800',
    'x:ps-3 x:before:start-0 x:pt-1 x:ms-3'
  ),
  wrapper: cn('x:p-4 x:overflow-y-auto nextra-scrollbar nextra-mask'),
  footer: cn(
    'nextra-sidebar-footer x:border-t nextra-border x:flex x:items-center x:gap-2 x:py-4 x:mx-4'
  )
}

type FolderProps = {
  item: PageItem | MenuItem | Item
  anchors: Heading[]
  onFocus: FocusEventHandler
  level: number
}

const Folder: FC<FolderProps> = ({ item: _item, anchors, onFocus, level }) => {
  const routeOriginal = useFSRoute()
  const route = routeOriginal.split('#', 1)[0]!

  const item = {
    ..._item,
    children:
      _item.type === 'menu' ? getMenuChildren(_item as any) : _item.children
  }

  const hasRoute = !!item.route // for item.type === 'menu' will be ''
  const active = hasRoute && [route, route + '/'].includes(item.route + '/')
  const activeRouteInside =
    active || (hasRoute && route.startsWith(item.route + '/'))

  const focusedRoute = useFocusedRoute()
  const focusedRouteInside = focusedRoute.startsWith(item.route + '/')

  const { theme } = item as Item
  const { defaultMenuCollapseLevel, autoCollapse } = useThemeConfig().sidebar

  const open =
    TreeState[item.route] === undefined
      ? active ||
        activeRouteInside ||
        focusedRouteInside ||
        (theme && 'collapsed' in theme
          ? !theme.collapsed
          : level < defaultMenuCollapseLevel)
      : TreeState[item.route] || focusedRouteInside

  const [, rerender] = useState<object>()

  const handleClick: MouseEventHandler<
    HTMLAnchorElement | HTMLButtonElement
  > = event => {
    const el = event.currentTarget
    const isClickOnIcon =
      el /* will be always <a> or <button> */ !==
      event.target /* can be <svg> or <path> */
    if (isClickOnIcon) {
      event.preventDefault()
    }
    const isOpen = el.parentElement!.classList.contains('open')
    // We don't toggle it if it's:
    // - a link
    // - not a click on icon
    // - not active link
    TreeState[item.route] = (isLink && !isClickOnIcon && !active) || !isOpen
    rerender({})
  }

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

    if (autoCollapse) {
      updateAndPruneTreeState()
    } else {
      updateTreeState()
    }
  }, [activeRouteInside, focusedRouteInside, item.route, autoCollapse])

  const isLink = 'frontMatter' in item
  // Use a button when a link doesn't have `href` because it impacts on SEO
  const ComponentToUse = isLink ? Anchor : Button

  return (
    <li className={cn({ open, active })}>
      <ComponentToUse
        {...(isLink
          ? { href: item.route, prefetch: false }
          : { 'data-href': item.route })}
        className={cn(
          'x:items-center x:justify-between x:gap-2',
          !isLink && 'x:text-start x:w-full',
          classes.link,
          active ? classes.active : classes.inactive
        )}
        onClick={handleClick}
        onFocus={onFocus}
      >
        {item.title}
        <ArrowRightIcon
          height="18"
          className={cn(
            'x:shrink-0',
            'x:rounded-sm x:p-0.5 x:hover:bg-gray-800/5 x:dark:hover:bg-gray-100/5',
            'x:motion-reduce:transition-none x:origin-center x:transition-all x:rtl:-rotate-180',
            open && 'x:ltr:rotate-90 x:rtl:-rotate-270'
          )}
        />
      </ComponentToUse>
      {item.children && (
        <Collapse isOpen={open}>
          <Menu
            className={classes.border}
            // @ts-expect-error -- fixme
            directories={item.children}
            anchors={anchors}
            level={level}
          />
        </Collapse>
      )}
    </li>
  )
}

function getMenuChildren(menu: MenuItem) {
  const routes = Object.fromEntries(
    (menu.children || []).map(route => [route.name, route])
  )
  return Object.entries(menu.items || {}) // eslint-disable-line @typescript-eslint/no-unnecessary-condition -- fixme
    .map(([key, item]) => ({
      ...(routes[key] || { name: key /* for React key prop */ }),
      ...(item as object)
    }))
}

const Separator: FC<{ title: ReactNode }> = ({ title }) => {
  return (
    <li
      className={cn(
        '[word-break:break-word]',
        title
          ? 'x:not-first:mt-5 x:mb-2 x:px-2 x:py-1.5 x:text-sm x:font-semibold x:text-gray-900 x:dark:text-gray-100'
          : 'x:my-4'
      )}
    >
      {title || <hr className="x:mx-2 x:border-t nextra-border" />}
    </li>
  )
}

const handleClick = () => {
  setMenu(false)
}

const File: FC<{
  item: PageItem | Item
  anchors: Heading[]
  onFocus: FocusEventHandler
}> = ({ item, anchors, onFocus }) => {
  const route = useFSRoute()
  // It is possible that the item doesn't have any route - for example, an external link.
  const active = item.route && [route, route + '/'].includes(item.route + '/')
  const activeSlug = useActiveAnchor()

  if (item.type === 'separator') {
    return <Separator title={item.title} />
  }
  const href = (item as PageItem).href || item.route
  return (
    <li className={cn({ active })}>
      <Anchor
        href={href}
        className={cn(classes.link, active ? classes.active : classes.inactive)}
        onFocus={onFocus}
        prefetch={false}
      >
        {item.title}
      </Anchor>
      {active && anchors.length > 0 && (
        <ul className={cn(classes.list, classes.border)}>
          {anchors.map(({ id, value }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cn(
                  classes.link,
                  'x:focus-visible:nextra-focus x:flex x:gap-2 x:before:opacity-25 x:before:content-["#"]',
                  id === activeSlug ? classes.active : classes.inactive
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
  className?: string
  level: number
}

const handleFocus: FocusEventHandler<HTMLAnchorElement> = event => {
  const route =
    event.target.getAttribute('href') || event.target.dataset.href || ''
  setFocusedRoute(route)
}

const Menu = forwardRef<HTMLUListElement, MenuProps>(
  ({ directories, anchors, className, level }, forwardedRef) => (
    <ul className={cn(classes.list, className)} ref={forwardedRef}>
      {directories.map(item => {
        const ComponentToUse =
          item.type === 'menu' || item.children?.length ? Folder : File

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
)
Menu.displayName = 'Menu'

export const MobileNav: FC = () => {
  const { directories } = useConfig().normalizePagesResult
  const toc = useTOC()

  const menu = useMenu()
  const pathname = usePathname()
  const hash = useHash()

  useEffect(() => {
    setMenu(false)
    // Close mobile menu when path changes or hash changes (e.g. clicking on search result which points to the current page)
  }, [pathname, hash])

  const anchors = toc.filter(v => v.depth === 2)
  const sidebarRef = useRef<HTMLUListElement>(null!)

  useEffect(() => {
    const sidebar = sidebarRef.current
    const activeLink = sidebar.querySelector('li.active')

    if (activeLink && menu) {
      scrollIntoView(activeLink, {
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: sidebar.parentNode as HTMLElement
      })
    }
  }, [menu])

  const themeConfig = useThemeConfig()
  const hasI18n = themeConfig.i18n.length > 0
  const hasMenu = themeConfig.darkMode || hasI18n

  return (
    <aside
      className={cn(
        'nextra-mobile-nav', // targeted from userspace
        'x:flex x:flex-col',
        'x:fixed x:inset-0 x:pt-(--nextra-navbar-height) x:z-20 x:overscroll-contain',
        'x:[contain:layout_style]',
        'x:md:hidden',
        'x:[.nextra-banner:not([class$=hidden])~&]:pt-[calc(var(--nextra-banner-height)+var(--nextra-navbar-height))]',
        'x:bg-nextra-bg',
        menu
          ? 'x:[transform:translate3d(0,0,0)]'
          : 'x:[transform:translate3d(0,-100%,0)]'
      )}
    >
      {themeConfig.search && (
        <div className="x:px-4 x:pt-4">{themeConfig.search}</div>
      )}
      <Menu
        ref={sidebarRef}
        className={classes.wrapper}
        // The mobile dropdown menu, shows all the directories.
        directories={directories}
        // Always show the anchor links on mobile (`md`).
        anchors={anchors}
        level={0}
      />

      {hasMenu && (
        <div className={cn(classes.footer, 'x:mt-auto')}>
          <ThemeSwitch className="x:grow" />
          <LocaleSwitch className="x:grow x:justify-end" />
        </div>
      )}
    </aside>
  )
}

let lastScrollPosition = 0

const handleScrollEnd: ComponentProps<'div'>['onScrollEnd'] = event => {
  lastScrollPosition = event.currentTarget.scrollTop
}

export const Sidebar: FC = () => {
  const toc = useTOC()
  const { normalizePagesResult, hideSidebar } = useConfig()
  const themeConfig = useThemeConfig()
  const [isExpanded, setIsExpanded] = useState(themeConfig.sidebar.defaultOpen)
  const [showToggleAnimation, setToggleAnimation] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null!)
  const sidebarControlsId = useId()

  const { docsDirectories, activeThemeContext } = normalizePagesResult
  const includePlaceholder = activeThemeContext.layout === 'default'

  useEffect(() => {
    if (window.innerWidth < 768) {
      return
    }
    const sidebar = sidebarRef.current

    // Since `<Sidebar>` is placed in `useMDXComponents.wrapper` on client side navigation he will
    // be remounted, this is a workaround to restore the scroll position, and will be fixed in Nextra 5
    if (lastScrollPosition) {
      sidebar.scrollTop = lastScrollPosition
      return
    }

    const activeLink = sidebar.querySelector('li.active')
    if (activeLink) {
      scrollIntoView(activeLink, {
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: sidebar.parentNode as HTMLDivElement
      })
    }
  }, [])

  const anchors =
    // hide the anchors in the sidebar when `floatTOC` is enabled.
    themeConfig.toc.float ? [] : toc.filter(v => v.depth === 2)

  const hasI18n = themeConfig.i18n.length > 0
  const hasMenu =
    themeConfig.darkMode || hasI18n || themeConfig.sidebar.toggleButton

  return (
    <>
      {includePlaceholder && hideSidebar && (
        <div className="x:max-xl:hidden x:h-0 x:w-64 x:shrink-0" />
      )}
      <aside
        id={sidebarControlsId}
        className={cn(
          'nextra-sidebar x:print:hidden',
          'x:transition-all x:ease-in-out',
          'x:max-md:hidden x:flex x:flex-col',
          'x:h-[calc(100dvh-var(--nextra-navbar-height))]',
          'x:top-(--nextra-navbar-height) x:shrink-0',
          isExpanded ? 'x:w-64' : 'x:w-20',
          hideSidebar ? 'x:hidden' : 'x:sticky'
        )}
      >
        <div
          className={cn(
            classes.wrapper,
            'x:grow',
            !isExpanded && 'no-scrollbar'
          )}
          ref={sidebarRef}
          onScrollEnd={handleScrollEnd} // eslint-disable-line react/no-unknown-property
        >
          {/* without !hideSidebar check <Collapse />'s inner.clientWidth on `layout: "raw"` will be 0 and element will not have width on initial loading */}
          {(!hideSidebar || !isExpanded) && (
            <Collapse isOpen={isExpanded} horizontal>
              <Menu
                // The sidebar menu, shows only the docs directories.
                directories={docsDirectories}
                anchors={anchors}
                level={0}
              />
            </Collapse>
          )}
        </div>
        {hasMenu && (
          <div
            className={cn(
              'x:sticky x:bottom-0 x:bg-nextra-bg',
              classes.footer,
              !isExpanded && 'x:flex-wrap x:justify-center',
              showToggleAnimation && [
                'x:*:opacity-0',
                isExpanded
                  ? 'x:*:animate-[fade-in_1s_ease_.2s_forwards]'
                  : 'x:*:animate-[fade-in2_1s_ease_.2s_forwards]'
              ]
            )}
          >
            <LocaleSwitch
              lite={!isExpanded}
              className={isExpanded ? 'x:grow' : ''}
            />
            <ThemeSwitch
              lite={!isExpanded || hasI18n}
              className={!isExpanded || hasI18n ? '' : 'x:grow'}
            />
            {themeConfig.sidebar.toggleButton && (
              <Button
                aria-expanded={isExpanded}
                aria-controls={sidebarControlsId}
                title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                className={({ hover }) =>
                  cn(
                    'x:rounded-md x:p-2',
                    hover
                      ? 'x:bg-gray-200 x:text-gray-900 x:dark:bg-primary-100/5 x:dark:text-gray-50'
                      : 'x:text-gray-600 x:dark:text-gray-400'
                  )
                }
                onClick={() => {
                  setIsExpanded(prev => !prev)
                  setToggleAnimation(true)
                }}
              >
                <ExpandIcon
                  height="12"
                  className={cn(
                    !isExpanded && 'x:*:first:origin-[35%] x:*:first:rotate-180'
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
