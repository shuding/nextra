import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useRouter } from 'next/router'
import 'focus-visible'
import { SkipNavContent } from '@reach/skip-nav'
import { ThemeProvider } from 'next-themes'
import { PageMapItem, PageOpts } from 'nextra'
import cn from 'classnames'
import Head from './head'
import Navbar from './navbar'
import Footer, { NavLinks } from './footer'
import { MDXTheme } from './misc/theme'
import Sidebar from './sidebar'
import ToC from './toc'
import { ThemeConfigContext, useConfig } from './config'
import { ActiveAnchor } from './misc/active-anchor'
import defaultConfig from './misc/default.config'
import { getFSRoute } from './utils/get-fs-route'
import { MenuContext } from './utils/menu-context'
import normalizePages from './utils/normalize-pages'
import { DocsThemeConfig, PageTheme } from './types'
import './polyfill'
import Breadcrumb from './breadcrumb'
import renderComponent from './utils/render-component'
import scrollIntoView from 'scroll-into-view-if-needed'

let resizeObserver: ResizeObserver
if (typeof window !== 'undefined') {
  resizeObserver =
    resizeObserver! ||
    new ResizeObserver(entries => {
      if (window.location.hash) {
        const node = entries[0].target.ownerDocument.querySelector(
          window.location.hash
        )

        if (node) {
          scrollIntoView(node)
        }
      }
    })
}

function useDirectoryInfo(pageMap: PageMapItem[]) {
  const { locale = 'en-US', defaultLocale, asPath } = useRouter()

  return useMemo(() => {
    const fsPath = getFSRoute(asPath, locale)
    return normalizePages({
      list: pageMap,
      locale,
      defaultLocale,
      route: fsPath
    })
  }, [pageMap, locale, defaultLocale, asPath])
}

interface BodyProps {
  themeContext: PageTheme
  breadcrumb?: ReactNode
  toc?: ReactNode
  timestamp?: number
  navLinks: ReactNode
  children: ReactNode
}

const Body = ({
  themeContext,
  breadcrumb,
  navLinks,
  timestamp,
  children
}: BodyProps): ReactElement => {
  const config = useConfig()
  const { locale = 'en-US' } = useRouter()
  const date = timestamp ? new Date(timestamp) : null
  const mainElement = useRef<HTMLElement>(null)

  useEffect(() => {
    if (mainElement.current) {
      resizeObserver.observe(mainElement.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <>
      <SkipNavContent />
      {themeContext.layout === 'full' ? (
        <article className="nextra-body full relative justify-center overflow-x-hidden pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
          <MDXTheme>{children}</MDXTheme>
          {date && config.gitTimestamp ? (
            <div className="pointer-default mt-12 mb-8 block text-right text-xs text-gray-500 dark:text-gray-400">
              {typeof config.gitTimestamp === 'string'
                ? config.gitTimestamp +
                  ' ' +
                  date.toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : renderComponent(config.gitTimestamp, {
                    timestamp: date,
                    locale
                  })}
            </div>
          ) : (
            <div className="mt-16" />
          )}
          {navLinks}
        </article>
      ) : themeContext.layout === 'raw' ? (
        <div className="nextra-body full expand relative overflow-x-hidden">
          {children}
        </div>
      ) : (
        <article
          className={cn(
            'nextra-body relative flex w-full min-w-0 max-w-full justify-center pb-8 pr-[calc(env(safe-area-inset-right)-1.5rem)]',
            themeContext.typesetting
              ? 'nextra-body-typesetting-' + themeContext.typesetting
              : ''
          )}
        >
          <main
            className="z-10 w-full min-w-0 max-w-4xl px-6 pt-4 md:px-8"
            ref={mainElement}
          >
            {breadcrumb}
            <MDXTheme>{children}</MDXTheme>
            {date && config.gitTimestamp ? (
              <div className="pointer-default mt-12 mb-8 block text-right text-xs text-gray-500 dark:text-gray-400">
                {typeof config.gitTimestamp === 'string'
                  ? config.gitTimestamp +
                    ' ' +
                    date.toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : renderComponent(config.gitTimestamp, {
                      timestamp: date,
                      locale
                    })}
              </div>
            ) : (
              <div className="mt-16" />
            )}
            {navLinks}
          </main>
        </article>
      )}
    </>
  )
}

const Content = ({
  filename,
  pageMap,
  meta,
  titleText,
  headings,
  timestamp,
  children
}: PageOpts & { children: ReactNode }): ReactElement => {
  const { route, locale = 'en-US' } = useRouter()
  const config = useConfig()

  const {
    activeType,
    activeIndex,
    activeThemeContext,
    activePath,
    topLevelNavbarItems,
    docsDirectories,
    flatDirectories,
    flatDocsDirectories,
    directories
  } = useDirectoryInfo(pageMap)

  const filepath = route.slice(0, route.lastIndexOf('/') + 1)
  const filepathWithName = filepath + filename
  const title = meta.title || titleText || 'Untitled'
  const isRTL = useMemo(() => {
    if (!config.i18n) return config.direction === 'rtl'
    const localeConfig = config.i18n.find(l => l.locale === locale)
    return localeConfig && localeConfig.direction === 'rtl'
  }, [config.i18n, locale])

  const [menu, setMenu] = useState(false)
  const themeContext = { ...activeThemeContext, ...meta }

  const hideSidebar = !themeContext.sidebar || themeContext.layout === 'raw'
  const hideToc = !themeContext.toc || themeContext.layout === 'raw'
  return (
    <MenuContext.Provider
      value={{
        menu,
        setMenu,
        defaultMenuCollapsed: !!config.defaultMenuCollapsed
      }}
    >
      <Head title={title} locale={locale} meta={meta} />
      <div
        className={cn('nextra-container main-container flex flex-col', {
          rtl: isRTL,
          'menu-active': menu
        })}
      >
        {themeContext.navbar ? (
          <Navbar
            isRTL={isRTL}
            flatDirectories={flatDirectories}
            items={topLevelNavbarItems}
          />
        ) : null}
        <ActiveAnchor>
          <div className="mx-auto flex w-full max-w-[90rem] flex-1 items-stretch">
            <div className="flex w-full flex-1">
              <Sidebar
                docsDirectories={docsDirectories}
                flatDirectories={flatDirectories}
                fullDirectories={directories}
                headings={headings}
                isRTL={isRTL}
                asPopover={activeType === 'page' || hideSidebar}
                includePlaceholder={themeContext.layout === 'default'}
              />
              {activeType === 'page' ||
              hideToc ||
              themeContext.layout !== 'default' ? (
                themeContext.layout === 'full' ||
                themeContext.layout === 'raw' ? null : (
                  <div className="nextra-toc order-last hidden w-64 flex-shrink-0 px-4 text-sm xl:block" />
                )
              ) : (
                <ToC
                  headings={config.floatTOC ? headings : null}
                  filepathWithName={filepathWithName}
                />
              )}
              <Body
                themeContext={themeContext}
                breadcrumb={
                  activeType !== 'page' && themeContext.breadcrumb ? (
                    <Breadcrumb activePath={activePath} />
                  ) : null
                }
                navLinks={
                  activeType !== 'page' && themeContext.pagination ? (
                    <NavLinks
                      flatDirectories={flatDocsDirectories}
                      currentIndex={activeIndex}
                      isRTL={isRTL}
                    />
                  ) : null
                }
                timestamp={timestamp}
              >
                {children}
              </Body>
            </div>
          </div>
        </ActiveAnchor>
        {themeContext.footer && config.footer ? (
          <Footer menu={activeType === 'page' || hideSidebar} />
        ) : null}
      </div>
    </MenuContext.Provider>
  )
}

const createLayout = (opts: PageOpts, config: DocsThemeConfig) => {
  const extendedConfig = {
    ...defaultConfig,
    ...config,
    unstable_flexsearch: opts.unstable_flexsearch
  }
  const nextThemes = extendedConfig.nextThemes || {}
  const Page = ({ children }: { children: ReactNode }): ReactNode => children
  Page.getLayout = (page: ReactNode): ReactElement => (
    <ThemeConfigContext.Provider value={extendedConfig}>
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
        defaultTheme={nextThemes.defaultTheme}
        storageKey={nextThemes.storageKey}
        forcedTheme={nextThemes.forcedTheme}
      >
        <Content {...opts}>{page}</Content>
      </ThemeProvider>
    </ThemeConfigContext.Provider>
  )

  return Page
}
export * from './types'
export default createLayout
