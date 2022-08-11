import type { PageMapItem, PageOpts } from 'nextra'
import type { FC, ReactElement, ReactNode } from 'react'

import React, { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import 'focus-visible'
import scrollIntoView from 'scroll-into-view-if-needed'
import { SkipNavContent } from '@reach/skip-nav'
import cn from 'clsx'

import './polyfill'
import {
  Head,
  Navbar,
  Footer,
  NavLinks,
  Sidebar,
  TOC,
  Breadcrumb,
  Banner
} from './components'
import { MDXTheme } from './mdx-theme'
import {
  ActiveAnchorProvider,
  ConfigProvider,
  useConfig,
  useMenu
} from './contexts'
import { DEFAULT_LOCALE, IS_BROWSER } from './constants'
import { getFSRoute, normalizePages, renderComponent } from './utils'
import { Context, DocsThemeConfig, PageTheme } from './types'

let resizeObserver: ResizeObserver
if (IS_BROWSER) {
  resizeObserver ||= new ResizeObserver(entries => {
    if (location.hash) {
      const node = entries[0].target.ownerDocument.querySelector(location.hash)
      if (node) {
        scrollIntoView(node)
      }
    }
  })
}

function useDirectoryInfo(pageMap: PageMapItem[]) {
  const { locale = DEFAULT_LOCALE, defaultLocale, route } = useRouter()

  return useMemo(() => {
    // asPath can return redirected url
    const fsPath = getFSRoute(route, locale)
    return normalizePages({
      list: pageMap,
      locale,
      defaultLocale,
      route: fsPath
    })
  }, [pageMap, locale, defaultLocale, route])
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
  const { locale = DEFAULT_LOCALE } = useRouter()
  const mainElement = useRef<HTMLElement>(null)

  useEffect(() => {
    if (mainElement.current) {
      resizeObserver.observe(mainElement.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  if (themeContext.layout === 'raw') {
    return (
      <div className="nextra-body full relative overflow-x-hidden">
        {children}
      </div>
    )
  }

  const date =
    themeContext.timestamp && config.gitTimestamp && timestamp
      ? new Date(timestamp)
      : null

  const gitTimestampEl = date ? (
    <div className="pointer-default mt-12 mb-8 block text-right text-xs text-gray-500 dark:text-gray-400">
      {typeof config.gitTimestamp === 'string'
        ? `${config.gitTimestamp} ${date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}`
        : renderComponent(config.gitTimestamp, { timestamp: date })}
    </div>
  ) : (
    <div className="mt-16" />
  )

  if (themeContext.layout === 'full') {
    return (
      <article className="nextra-body full relative justify-center overflow-x-hidden pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
        <MDXTheme>{children}</MDXTheme>
        {gitTimestampEl}
        {navLinks}
      </article>
    )
  }

  return (
    <article
      className={cn(
        'nextra-body relative flex w-full min-w-0 max-w-full justify-center pb-8 pr-[calc(env(safe-area-inset-right)-1.5rem)]',
        themeContext.typesetting &&
          `nextra-body-typesetting-${themeContext.typesetting}`
      )}
    >
      <main
        className="z-10 w-full min-w-0 max-w-4xl px-6 pt-4 md:px-8"
        ref={mainElement}
      >
        {breadcrumb}
        <MDXTheme>{children}</MDXTheme>
        {gitTimestampEl}
        {navLinks}
      </main>
    </article>
  )
}

const InnerLayout = ({
  filename,
  pageMap,
  meta,
  headings,
  timestamp,
  children
}: PageOpts & { children: ReactNode }): ReactElement => {
  const { route, locale = DEFAULT_LOCALE } = useRouter()
  const config = useConfig()
  const { menu } = useMenu()
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
  const isRTL = useMemo(() => {
    if (!config.i18n) return config.direction === 'rtl'
    const localeConfig = config.i18n.find(l => l.locale === locale)
    return localeConfig && localeConfig.direction === 'rtl'
  }, [config.i18n, locale])

  const themeContext = { ...activeThemeContext, ...meta }

  const hideSidebar = !themeContext.sidebar || themeContext.layout === 'raw'
  const hideToc = !themeContext.toc || themeContext.layout === 'raw'
  const asPopover = activeType === 'page' || hideSidebar
  return (
    <div
      className={cn('nextra-container main-container flex flex-col', {
        rtl: isRTL,
        'menu-active': menu
      })}
    >
      <Head />
      <Banner />
      {themeContext.navbar ? (
        <Navbar
          isRTL={isRTL}
          flatDirectories={flatDirectories}
          items={topLevelNavbarItems}
        />
      ) : null}
      <div
        className={cn(
          'mx-auto flex w-full flex-1 items-stretch',
          themeContext.layout !== 'raw' && 'max-w-[90rem]'
        )}
      >
        <div className="flex w-full flex-1">
          <ActiveAnchorProvider>
            <Sidebar
              docsDirectories={docsDirectories}
              flatDirectories={flatDirectories}
              fullDirectories={directories}
              headings={headings}
              isRTL={isRTL}
              asPopover={asPopover}
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
              <TOC
                headings={config.floatTOC ? headings : []}
                filepathWithName={filepath + filename}
              />
            )}
            <SkipNavContent />
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
          </ActiveAnchorProvider>
        </div>
      </div>
      {themeContext.footer && config.footer ? (
        <Footer menu={asPopover} />
      ) : null}
    </div>
  )
}

const nextraPageContext: Record<string, Context> = {}

function Layout(props: any): ReactElement {
  const { route } = useRouter()
  const context = nextraPageContext[route]

  if (!context) throw new Error(`No content found for ${route}.`)
  const { pageOpts, Content } = context
  return (
    <ConfigProvider value={context}>
      <InnerLayout {...pageOpts}>
        <Content {...props} />
      </InnerLayout>
    </ConfigProvider>
  )
}

// Make sure the same component is always returned so Next.js will render the
// stable layout. We then put the actual content into a global store and use
// the route to identify it.
export default function withLayout(
  route: string,
  Content: FC,
  pageOpts: PageOpts,
  themeConfig: DocsThemeConfig
) {
  nextraPageContext[route] = {
    Content,
    pageOpts,
    themeConfig
  }

  return Layout
}

export { useConfig }
export { useTheme } from 'next-themes'
export * from './types'
export { getComponents } from './mdx-theme'
export {
  Bleed,
  Callout,
  Collapse,
  NotFoundPage,
  ServerSideErrorPage,
  Tabs,
  Tab
} from './components'
