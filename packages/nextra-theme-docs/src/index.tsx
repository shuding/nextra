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
import { DocsThemeConfig } from './types'
import './polyfill'

function useDirectoryInfo(pageMap: PageMapItem[]) {
  const { locale, defaultLocale, asPath } = useRouter()

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
  themeContext: Record<string, any>
  toc?: React.ReactNode
  navLinks: React.ReactNode
}

const Body: React.FC<BodyProps> = ({
  themeContext,
  toc,
  navLinks,
  children
}) => {
  return (
    <React.Fragment>
      <SkipNavContent />
      {themeContext.full ? (
        <article
          className={cn(
            'full relative overflow-x-hidden',
            !themeContext.sidebar ? 'expand' : ''
          )}
        >
          <MDXTheme>{children}</MDXTheme>
        </article>
      ) : (
        <article className="docs-container relative pb-8 w-full max-w-full flex min-w-0 pr-[calc(env(safe-area-inset-right)-1.5rem)]">
          <main className="mx-auto max-w-4xl px-6 md:px-8 pt-4 z-10 min-w-0 w-full">
            <MDXTheme>{children}</MDXTheme>
            {navLinks}
          </main>
          {toc}
        </article>
      )}
    </React.Fragment>
  )
}

interface LayoutProps {
  filename: string
  pageMap: PageMapItem[]
  meta: Record<string, any>
  titleText: string
  headings: Heading[]
}

const Layout: React.FC<LayoutProps> = ({
  filename,
  pageMap,
  meta,
  titleText,
  headings,
  children
}) => {
  const { route, locale } = useRouter()
  const config = useConfig()

  const {
    activeType,
    activeIndex,
    activeThemeContext,
    // pageDirectories,
    flatPageDirectories,
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

  return (
    <React.Fragment>
      <Head title={title} locale={locale} meta={meta} />
      <MenuContext.Provider
        value={{
          menu,
          setMenu,
          defaultMenuCollapsed: !!config.defaultMenuCollapsed
        }}
      >
        <div
          className={cn('nextra-container main-container flex flex-col', {
            rtl: isRTL
          })}
        >
          {themeContext.navbar ? (
            <Navbar
              isRTL={isRTL}
              flatDirectories={flatDirectories}
              flatPageDirectories={flatPageDirectories}
            />
          ) : null}
          <ActiveAnchor>
            <div className="max-w-[90rem] w-full mx-auto">
              <div className="flex flex-1 h-full">
                <Sidebar
                  directories={docsDirectories}
                  flatDirectories={flatDirectories}
                  fullDirectories={directories}
                  headings={headings}
                  isRTL={isRTL}
                  asPopover={activeType === 'page' || !themeContext.sidebar}
                />
                <Body
                  themeContext={themeContext}
                  toc={
                    activeType === 'page' ? null : themeContext.toc ? (
                      <ToC
                        headings={config.floatTOC ? headings : null}
                        filepathWithName={filepathWithName}
                      />
                    ) : null
                  }
                  navLinks={
                    activeType === 'page' ? null : themeContext.pagination ? (
                      <NavLinks
                        flatDirectories={flatDocsDirectories}
                        currentIndex={activeIndex}
                        isRTL={isRTL}
                      />
                    ) : null
                  }
                >
                  {children}
                </Body>
              </div>
            </div>
          </ActiveAnchor>
          {themeContext.footer && config.footer ? (
            <Footer menu={activeType === 'page' || !themeContext.sidebar} />
          ) : null}
        </div>
      </MenuContext.Provider>
    </React.Fragment>
  )
}

export default (opts: PageOpt, config: DocsThemeConfig) => {
  const extendedConfig = Object.assign({}, defaultConfig, config)
  return (props: any) => {
    return (
      <ThemeConfigContext.Provider value={extendedConfig}>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange={true}
          {...{
            defaultTheme: extendedConfig.nextThemes.defaultTheme,
            storageKey: extendedConfig.nextThemes.storageKey,
            forcedTheme: extendedConfig.nextThemes.forcedTheme
          }}
        >
          <Layout {...opts} {...props} />
        </ThemeProvider>
      </ThemeConfigContext.Provider>
    )
  }
}
