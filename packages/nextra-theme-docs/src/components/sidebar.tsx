import cn from 'clsx'
import type { Heading } from 'nextra'
import { useFSRoute, useMounted } from 'nextra/hooks'
import { ArrowRightIcon, ExpandIcon } from 'nextra/icons'
import type { Item, MenuItem, PageItem } from 'nextra/normalize-pages'
import type { ReactElement } from 'react'
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import { useActiveAnchor, useMenu, useThemeConfig } from '../contexts'
import { renderComponent } from '../utils'
import { Anchor } from './anchor'
import { Collapse } from './collapse'
import { LocaleSwitch } from './locale-switch'

const TreeState: Record<string, boolean> = Object.create(null)

const FocusedItemContext = createContext<null | string>(null)
FocusedItemContext.displayName = 'FocusedItem'
const OnFocusItemContext = createContext<null | ((item: string | null) => any)>(
  null
)
OnFocusItemContext.displayName = 'OnFocusItem'
const FolderLevelContext = createContext(0)
FolderLevelContext.displayName = 'FolderLevel'

const Folder = memo(function FolderInner(props: FolderProps) {
  const level = useContext(FolderLevelContext)
  return (
    <FolderLevelContext.Provider value={level + 1}>
      <FolderImpl {...props} />
    </FolderLevelContext.Provider>
  )
})

const classes = {
  link: cn(
    '_flex _rounded _px-2 _py-1.5 _text-sm _transition-colors [word-break:break-word]',
    '_cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:_border'
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
    'ltr:_pl-3 ltr:before:_left-0 rtl:_pr-3 rtl:before:_right-0'
  )
}

type FolderProps = {
  item: PageItem | MenuItem | Item
  anchors: Heading[]
}

function FolderImpl({ item, anchors }: FolderProps): ReactElement {
  const routeOriginal = useFSRoute()
  const [route] = routeOriginal.split('#')
  const active = [route, route + '/'].includes(item.route + '/')
  const activeRouteInside = active || route.startsWith(item.route + '/')

  const focusedRoute = useContext(FocusedItemContext)
  const focusedRouteInside = !!focusedRoute?.startsWith(item.route + '/')
  const level = useContext(FolderLevelContext)

  const { setMenu } = useMenu()
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
    const updateTreeState = () => {
      if (activeRouteInside || focusedRouteInside) {
        TreeState[item.route] = true
      }
    }
    const updateAndPruneTreeState = () => {
      if (activeRouteInside && focusedRouteInside) {
        TreeState[item.route] = true
      } else {
        delete TreeState[item.route]
      }
    }
    themeConfig.sidebar.autoCollapse
      ? updateAndPruneTreeState()
      : updateTreeState()
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
  const ComponentToUse = isLink ? Anchor : 'button'

  return (
    <li className={cn({ open, active })}>
      <ComponentToUse
        href={isLink ? item.route : undefined}
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
          className="_h-[18px] _min-w-[18px] _rounded-sm _p-0.5 hover:_bg-gray-800/5 dark:hover:_bg-gray-100/5"
          pathClassName={cn(
            '_origin-center _transition-transform rtl:_-rotate-180',
            open && 'ltr:_rotate-90 rtl:_rotate-[-270deg]'
          )}
        />
      </ComponentToUse>
      <Collapse className="ltr:_pr-0 rtl:_pl-0 _pt-1" isOpen={open}>
        {Array.isArray(item.children) ? (
          <Menu
            className={cn(classes.border, 'ltr:_ml-3 rtl:_mr-3')}
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
  return (
    <li
      className={cn(
        '[word-break:break-word]',
        title
          ? '_mt-5 _mb-2 _px-2 _py-1.5 _text-sm _font-semibold _text-gray-900 first:_mt-0 dark:_text-gray-100'
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
  anchors
}: {
  item: PageItem | Item
  anchors: Heading[]
}): ReactElement {
  const route = useFSRoute()
  const onFocus = useContext(OnFocusItemContext)

  // It is possible that the item doesn't have any route - for example an external link.
  const active = item.route && [route, route + '/'].includes(item.route + '/')
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
        onFocus={() => {
          onFocus?.(item.route)
        }}
        onBlur={() => {
          onFocus?.(null)
        }}
      >
        {item.title}
      </Anchor>
      {active && anchors.length > 0 && (
        <ul className={cn(classes.list, classes.border, 'ltr:_ml-3 rtl:_mr-3')}>
          {anchors.map(({ id, value }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cn(
                  classes.link,
                  '_flex _gap-2 before:_opacity-25 before:_content-["#"]',
                  activeAnchor[id]?.isActive ? classes.active : classes.inactive
                )}
                onClick={() => {
                  setMenu(false)
                }}
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
}

function Menu({
  directories,
  anchors,
  className,
  onlyCurrentDocs
}: MenuProps): ReactElement {
  return (
    <ul className={cn(classes.list, className)}>
      {directories.map(item =>
        !onlyCurrentDocs || item.isUnderCurrentDocsTree ? (
          item.type === 'menu' ||
          (item.children && (item.children.length || !item.withIndexPage)) ? (
            <Folder key={item.name} item={item} anchors={anchors} />
          ) : (
            <File key={item.name} item={item} anchors={anchors} />
          )
        ) : null
      )}
    </ul>
  )
}

interface SideBarProps {
  docsDirectories: PageItem[]
  fullDirectories: Item[]
  asPopover?: boolean
  toc: Heading[]
  includePlaceholder: boolean
}

export function Sidebar({
  docsDirectories,
  fullDirectories,
  asPopover = false,
  toc,
  includePlaceholder
}: SideBarProps): ReactElement {
  const { menu, setMenu } = useMenu()
  const [focused, setFocused] = useState<null | string>(null)
  const [showSidebar, setSidebar] = useState(true)
  const [showToggleAnimation, setToggleAnimation] = useState(false)

  const anchors = useMemo(() => toc.filter(v => v.depth === 2), [toc])
  const sidebarRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mounted = useMounted()
  useEffect(() => {
    if (menu) {
      document.body.classList.add('_overflow-hidden', 'md:_overflow-auto')
    } else {
      document.body.classList.remove('_overflow-hidden', 'md:_overflow-auto')
    }
  }, [menu])

  useEffect(() => {
    const activeElement = sidebarRef.current?.querySelector('li.active')

    if (activeElement && (window.innerWidth > 767 || menu)) {
      const scroll = () => {
        scrollIntoView(activeElement, {
          block: 'center',
          inline: 'center',
          scrollMode: 'always',
          boundary: containerRef.current
        })
      }
      if (menu) {
        // needs for mobile since menu has transition transform
        setTimeout(scroll, 300)
      } else {
        scroll()
      }
    }
  }, [menu])

  const themeConfig = useThemeConfig()
  const hasI18n = themeConfig.i18n.length > 0
  const hasMenu =
    themeConfig.darkMode || hasI18n || themeConfig.sidebar.toggleButton

  return (
    <>
      {includePlaceholder && asPopover && (
        <div className="max-xl:_hidden _h-0 _w-64 _shrink-0" />
      )}
      <div
        className={cn(
          'motion-reduce:_transition-none [transition:background-color_1.5s_ease]',
          menu
            ? '_fixed _inset-0 _z-10 _bg-black/80 dark:_bg-black/60'
            : '_bg-transparent'
        )}
        onClick={() => setMenu(false)}
      />
      <aside
        className={cn(
          'nextra-sidebar-container _flex _flex-col',
          'md:_top-16 md:_shrink-0 motion-reduce:_transform-none',
          '_transform-gpu _transition-all _ease-in-out',
          'print:_hidden',
          showSidebar ? 'md:_w-64' : 'md:_w-20',
          asPopover ? 'md:_hidden' : 'md:_sticky md:_self-start',
          menu
            ? 'max-md:[transform:translate3d(0,0,0)]'
            : 'max-md:[transform:translate3d(0,-100%,0)]'
        )}
        ref={containerRef}
      >
        {process.env.NEXTRA_SEARCH && (
          <div className="_px-4 _pt-4 md:_hidden">
            {renderComponent(themeConfig.search.component)}
          </div>
        )}
        <FocusedItemContext.Provider value={focused}>
          <OnFocusItemContext.Provider
            value={item => {
              setFocused(item)
            }}
          >
            <div
              className={cn(
                '_overflow-y-auto _overflow-x-hidden',
                '_p-4 _grow md:_h-[calc(100vh-var(--nextra-navbar-height)-var(--nextra-menu-height))]',
                showSidebar ? 'nextra-scrollbar' : 'no-scrollbar'
              )}
              ref={sidebarRef}
            >
              {/* without asPopover check <Collapse />'s inner.clientWidth on `layout: "raw"` will be 0 and element will not have width on initial loading */}
              {(!asPopover || !showSidebar) && (
                <Collapse isOpen={showSidebar} horizontal>
                  <Menu
                    className="nextra-menu-desktop max-md:_hidden"
                    // The sidebar menu, shows only the docs directories.
                    directories={docsDirectories}
                    // When the viewport size is larger than `md`, hide the anchors in
                    // the sidebar when `floatTOC` is enabled.
                    anchors={themeConfig.toc.float ? [] : anchors}
                    onlyCurrentDocs
                  />
                </Collapse>
              )}
              {mounted && window.innerWidth < 768 && (
                <Menu
                  className="nextra-menu-mobile md:_hidden"
                  // The mobile dropdown menu, shows all the directories.
                  directories={fullDirectories}
                  // Always show the anchor links on mobile (`md`).
                  anchors={anchors}
                />
              )}
            </div>
          </OnFocusItemContext.Provider>
        </FocusedItemContext.Provider>

        {hasMenu && (
          <div
            className={cn(
              'nextra-sidebar-footer _sticky _bottom-0',
              '_flex _items-center _gap-2 _mx-4 _py-4',
              showSidebar
                ? hasI18n && '_justify-end'
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
              <div
                className={
                  showSidebar && !hasI18n ? '_grow _flex _flex-col' : ''
                }
              >
                {renderComponent(themeConfig.themeSwitch.component, {
                  lite: !showSidebar || hasI18n
                })}
              </div>
            )}
            {themeConfig.sidebar.toggleButton && (
              <button
                title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
                className="max-md:_hidden _h-7 _rounded-md _transition-colors _text-gray-600 dark:_text-gray-400 _px-2 hover:_bg-gray-100 hover:_text-gray-900 dark:hover:_bg-primary-100/5 dark:hover:_text-gray-50"
                onClick={() => {
                  setSidebar(!showSidebar)
                  setToggleAnimation(true)
                }}
              >
                <ExpandIcon isOpen={showSidebar} />
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  )
}
