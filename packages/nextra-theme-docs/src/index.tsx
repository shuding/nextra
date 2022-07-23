import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import 'focus-visible'
import { SkipNavContent } from '@reach/skip-nav'
import { ThemeProvider } from 'next-themes'
import { Heading, PageMapItem, PageOpt } from 'nextra'
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
import { DocsThemeConfig, Meta, PageTheme } from './types'
import './polyfill'
import Breadcrumb from './breadcrumb'
import renderComponent from './utils/render-component'

function useDirectoryInfo(pageMap: PageMapItem[]) {
  const { locale, defaultLocale, asPath } = useRouter()

  return useMemo(() => {
    const fsPath = getFSRoute(asPath, locale)
    return normalizePages({
      list: pageMap,
      locale: locale ? locale : 'en-US',
      defaultLocale,
      route: fsPath
    })
  }, [pageMap, locale, defaultLocale, asPath])
}

interface BodyProps {
  themeContext: PageTheme
  breadcrumb?: React.ReactNode
  toc?: React.ReactNode
  timestamp?: number
  navLinks: React.ReactNode
}

const Body: React.FC<BodyProps> = ({
  themeContext,
  breadcrumb,
  navLinks,
  timestamp,
  children
}) => {
  const config = useConfig()
  const { locale } = useRouter()
  const date = timestamp ? new Date(timestamp) : null

  return (
    <React.Fragment>
      <SkipNavContent />
      {themeContext.layout === 'full' ? (
        <article className="nextra-body full relative justify-center overflow-x-hidden pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
          <MDXTheme>{children}</MDXTheme>
          {date && config.gitTimestamp ? (
            <div className="text-xs text-right block text-gray-500 mt-12 mb-8 dark:text-gray-400 pointer-default">
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
        <div className="nextra-body full relative overflow-x-hidden expand">
          {children}
        </div>
      ) : (
        <article
          className={cn(
            'nextra-body relative pb-8 w-full justify-center max-w-full flex min-w-0 pr-[calc(env(safe-area-inset-right)-1.5rem)]',
            themeContext.typesetting
              ? 'nextra-body-typesetting-' + themeContext.typesetting
              : ''
          )}
        >
          <main className="max-w-4xl px-6 md:px-8 pt-4 z-10 min-w-0 w-full">
            {breadcrumb}
            <MDXTheme>{children}</MDXTheme>
            {date && config.gitTimestamp ? (
              <div className="text-xs text-right block text-gray-500 mt-12 mb-8 dark:text-gray-400 pointer-default">
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
    </React.Fragment>
  )
}
interface LayoutProps {
  filename: string
  pageMap: PageMapItem[]
  meta: Meta
  titleText: string | null
  headings?: Heading[]
  timestamp?: number
}

const Content: React.FC<LayoutProps> = ({
  filename,
  pageMap,
  meta,
  titleText,
  headings,
  timestamp,
  children
}) => {
  const { route, locale = 'en-US' } = useRouter()
  const config = useConfig()

  const {
    activeType,
    activeIndex,
    activeThemeContext,
    activePath,
    // pageDirectories,
    topLevelPageItems,
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

  const headingArr = headings ?? []
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
              items={topLevelPageItems}
            />
          ) : null}
          <ActiveAnchor>
            <div className="max-w-[90rem] w-full mx-auto flex flex-1 items-stretch">
              <div className="flex flex-1 w-full">
                <Sidebar
                  directories={docsDirectories}
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
                    <div className="nextra-toc w-64 hidden xl:block text-sm px-4 order-last flex-shrink-0" />
                  )
                ) : (
                  <ToC
                    headings={config.floatTOC ? headingArr : null}
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
interface DocsLayoutProps extends PageOpt {
  meta: Meta
}
const createLayout = (opts: DocsLayoutProps, config: DocsThemeConfig) => {
  const extendedConfig = Object.assign({}, defaultConfig, config, opts)
  const nextThemes = extendedConfig.nextThemes || {}
  const Page = ({ children }: { children: React.ReactChildren }) => children

  Page.getLayout = (page: any) => (
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
