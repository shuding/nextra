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

function useDirectoryInfo(pageMap: PageMapItem[]) {
  const { locale, defaultLocale, asPath } = useRouter()

  return useMemo(() => {
    const fsPath = getFSRoute(asPath, locale).split('#')[0]
    return normalizePages({
      list: pageMap,
      locale,
      defaultLocale,
      route: fsPath
    })
  }, [pageMap, locale, defaultLocale, asPath])
}

interface BodyProps {
  meta: Record<string, any>
  toc?: React.ReactNode
  navLinks: React.ReactNode
  MDXContent: React.FC
}

function Body({ meta, toc, navLinks, MDXContent }: BodyProps) {
  return (
    <React.Fragment>
      <SkipNavContent />
      {meta.full ? (
        <article className="relative w-full overflow-x-hidden">
          <MDXContent />
        </article>
      ) : (
        <article className="docs-container relative pb-8 w-full max-w-full flex min-w-0">
          <main className="mx-auto max-w-4xl px-6 md:px-8 pt-4 z-10 min-w-0 w-full">
            <MDXTheme MDXContent={MDXContent} />
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
  children: React.ReactNode
  MDXContent: React.FC
  titleText: string
  headings: Heading[]
}

const Layout = ({
  filename,
  pageMap,
  meta,
  titleText,
  MDXContent,
  headings
}: LayoutProps) => {
  const { route, locale } = useRouter()
  const config = useConfig()

  const {
    activeType,
    activeIndex,
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

  if (activeType === 'nav') {
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
              rtl: isRTL,
              page: true
            })}
          >
            <Navbar
              isRTL={isRTL}
              flatDirectories={flatDirectories}
              flatPageDirectories={flatPageDirectories}
            />
            <ActiveAnchor>
              <div className="max-w-[90rem] w-full mx-auto">
                <div className="flex flex-1 h-full">
                  <Sidebar
                    directories={flatPageDirectories}
                    flatDirectories={flatDirectories}
                    fullDirectories={directories}
                    mdShow={false}
                    headings={headings}
                    isRTL={isRTL}
                  />
                  <Body meta={meta} navLinks={null} MDXContent={MDXContent} />
                </div>
              </div>
            </ActiveAnchor>
            {config.footer ? <Footer /> : null}
          </div>
        </MenuContext.Provider>
      </React.Fragment>
    )
  }

  // Docs layout
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
          <Navbar
            isRTL={isRTL}
            flatDirectories={flatDirectories}
            flatPageDirectories={flatPageDirectories}
          />
          <ActiveAnchor>
            <div className="max-w-[90rem] w-full mx-auto">
              <div className="flex flex-1 h-full">
                <Sidebar
                  directories={docsDirectories}
                  flatDirectories={flatDirectories}
                  fullDirectories={directories}
                  headings={headings}
                  isRTL={isRTL}
                />
                <Body
                  meta={meta}
                  toc={
                    <ToC
                      headings={config.floatTOC ? headings : null}
                      filepathWithName={filepathWithName}
                    />
                  }
                  navLinks={
                    <NavLinks
                      flatDirectories={flatDocsDirectories}
                      currentIndex={activeIndex}
                      isRTL={isRTL}
                    />
                  }
                  MDXContent={MDXContent}
                />
              </div>
            </div>
          </ActiveAnchor>
          {config.footer ? <Footer /> : null}
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
        <ThemeProvider attribute="class" disableTransitionOnChange={true}>
          <Layout {...opts} {...props} />
        </ThemeProvider>
      </ThemeConfigContext.Provider>
    )
  }
}
