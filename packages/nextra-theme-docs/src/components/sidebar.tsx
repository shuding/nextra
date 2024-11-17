'use client'

import cn from 'clsx'
import { usePathname } from 'next/navigation'
import type { Heading } from 'nextra'
import { Anchor, Button, Collapse } from 'nextra/components'
import { useFSRoute } from 'nextra/hooks'
import { ArrowRightIcon, ExpandIcon } from 'nextra/icons'
import type { Item, MenuItem, PageItem } from 'nextra/normalize-pages'
import type { FC, FocusEventHandler, MouseEventHandler } from 'react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import {
  setFocusedRoute,
  setMenu,
  useActiveAnchor,
  useConfig,
  useFocusedRoute,
  useMenu,
  useThemeConfig,
  useToc
} from '../stores'
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
  list: cn('_grid _gap-1'),
  border: cn(
    '_relative before:_absolute before:_inset-y-1',
    'before:_w-px before:_bg-gray-200 before:_content-[""] dark:before:_bg-neutral-800',
    '_ps-3 before:_start-0 _pt-1 _ms-3'
  ),
  wrapper: cn('_p-4 _overflow-y-auto nextra-scrollbar mask'),
  footer: cn(
    'nextra-sidebar-footer bordered _flex _items-center _gap-2 _py-4 _mx-4'
  )
}

type FolderProps = {
  item: PageItem | MenuItem | Item
  anchors: Heading[]
  onFocus: FocusEventHandler
  level: number
}

const Folder: FC<FolderProps> = ({ item, anchors, onFocus, level }) => {
  const routeOriginal = useFSRoute()
  const [route] = routeOriginal.split('#')
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

  const handleClick: MouseEventHandler = useCallback(event => {
    const el = event.currentTarget
    const isClickOnIcon =
      el /* will be always <a> or <button> */ !==
      event.target /* can be <svg> or <path> */
    if (isClickOnIcon) {
      event.preventDefault()
    }
    const isOpen = el.parentElement!.classList.contains('open')
    const route = el.getAttribute('href') || el.getAttribute('data-href') || ''
    TreeState[route] = !isOpen
    rerender({})
  }, [])

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

  if (item.type === 'menu') {
    const menu = item as MenuItem
    const routes = Object.fromEntries(
      (menu.children || []).map(route => [route.name, route])
    )
    item.children = Object.entries(menu.items || {}).map(([key, item]) => {
      return {
        ...(routes[key] || { name: key /* for React key prop */ }),
        ...(item as object)
      }
    })
  }

  const isLink = 'frontMatter' in item
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
        onClick={handleClick}
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
      {item.children && (
        <Collapse isOpen={open}>
          <Menu
            className={classes.border}
            directories={item.children}
            anchors={anchors}
            level={level}
          />
        </Collapse>
      )}
    </li>
  )
}

const Separator: FC<{ title: string }> = ({ title }) => {
  return (
    <li
      className={cn(
        '[word-break:break-word]',
        title
          ? '[&:not(:first-child)]:_mt-5 _mb-2 _px-2 _py-1.5 _text-sm _font-semibold _text-gray-900 dark:_text-gray-100'
          : '_my-4'
      )}
    >
      {title || (
        <hr className="_mx-2 _border-t _border-gray-200 dark:_border-primary-100/10" />
      )}
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

  return (
    <li className={cn({ active })}>
      <Anchor
        href={(item as PageItem).href || item.route}
        className={cn(classes.link, active ? classes.active : classes.inactive)}
        onFocus={onFocus}
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
                  'focus-visible:nextra-focus _flex _gap-2 before:_opacity-25 before:_content-["#"]',
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

const handleFocus: FocusEventHandler = event => {
  const route =
    event.target.getAttribute('href') ||
    event.target.getAttribute('data-href') ||
    ''
  setFocusedRoute(route)
}

const Menu = forwardRef<HTMLUListElement, MenuProps>(
  ({ directories, anchors, className, level }, forwardedRef) => (
    <ul className={cn(classes.list, className)} ref={forwardedRef}>
      {directories.map(item => {
        const ComponentToUse =
          item.type === 'menu' ||
          (item.children && (item.children.length || !('frontMatter' in item)))
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
)
Menu.displayName = 'Menu'

export const MobileNav: FC = () => {
  const { directories } = useConfig().normalizePagesResult
  const toc = useToc()

  const menu = useMenu()
  const pathname = usePathname()

  useEffect(() => {
    setMenu(false)
  }, [pathname])

  const anchors = useMemo(() => toc.filter(v => v.depth === 2), [toc])
  const sidebarRef = useRef<HTMLUListElement>(null!)

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
  const hasMenu = themeConfig.darkMode || hasI18n

  return (
    <aside
      className={cn(
        '_flex _flex-col',
        '_fixed _inset-0 _pt-[--nextra-navbar-height] _z-10 _overscroll-contain',
        '[contain:layout_style]',
        'md:_hidden',
        String.raw`[.nextra-banner:not(.\_hidden)~&]:_pt-[calc(var(--nextra-banner-height)+var(--nextra-navbar-height))]`,
        '_bg-[rgb(var(--nextra-bg))]',
        menu
          ? '[transform:translate3d(0,0,0)]'
          : '[transform:translate3d(0,-100%,0)]'
      )}
    >
      {themeConfig.search && (
        <div className="_px-4 _pt-4">{themeConfig.search}</div>
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
        <div className={cn(classes.footer, '_mt-auto')}>
          <ThemeSwitch lite={hasI18n} className="_grow" />
          <LocaleSwitch />
        </div>
      )}
    </aside>
  )
}

export const Sidebar: FC<{ toc: Heading[] }> = ({ toc }) => {
  const { normalizePagesResult, hideSidebar } = useConfig()
  const [isExpanded, setIsExpanded] = useState(true)
  const [showToggleAnimation, setToggleAnimation] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const sidebarControlsId = useId()

  const { docsDirectories, activeThemeContext } = normalizePagesResult
  const includePlaceholder = activeThemeContext.layout === 'default'

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
  const anchors = useMemo(
    () =>
      // When the viewport size is larger than `md`, hide the anchors in
      // the sidebar when `floatTOC` is enabled.
      themeConfig.toc.float ? [] : toc.filter(v => v.depth === 2),
    [themeConfig.toc.float, toc]
  )
  const hasI18n = themeConfig.i18n.length > 0
  const hasMenu =
    themeConfig.darkMode || hasI18n || themeConfig.sidebar.toggleButton

  return (
    <>
      {includePlaceholder && hideSidebar && (
        <div className="max-xl:_hidden _h-0 _w-64 _shrink-0" />
      )}
      <aside
        id={sidebarControlsId}
        className={cn(
          'nextra-sidebar print:_hidden',
          '_transition-all _ease-in-out',
          'max-md:_hidden _flex _flex-col',
          '_h-[calc(100dvh-var(--nextra-menu-height))]',
          '_top-[--nextra-navbar-height] _shrink-0',
          isExpanded ? '_w-64' : '_w-20',
          hideSidebar ? '_hidden' : '_sticky'
        )}
      >
        <div
          className={cn(
            classes.wrapper,
            '_grow',
            !isExpanded && 'no-scrollbar'
          )}
          ref={sidebarRef}
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
              classes.footer,
              !isExpanded && '_flex-wrap _justify-center',
              showToggleAnimation && [
                '*:_opacity-0',
                isExpanded
                  ? '*:_animate-[fade-in_1s_ease_.2s_forwards]'
                  : '*:_animate-[fade-in2_1s_ease_.2s_forwards]'
              ]
            )}
          >
            <LocaleSwitch
              lite={!isExpanded}
              className={isExpanded ? '_grow' : ''}
            />
            <ThemeSwitch
              lite={!isExpanded || hasI18n}
              className={!isExpanded || hasI18n ? '' : '_grow'}
            />
            {themeConfig.sidebar.toggleButton && (
              <Button
                aria-expanded={isExpanded}
                aria-controls={sidebarControlsId}
                title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                className={({ hover }) =>
                  cn(
                    '_rounded-md _p-2',
                    hover
                      ? '_bg-gray-100 _text-gray-900 dark:_bg-primary-100/5 dark:_text-gray-50'
                      : '_text-gray-600 dark:_text-gray-400'
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
                    !isExpanded && 'first:*:_origin-[35%] first:*:_rotate-180'
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
