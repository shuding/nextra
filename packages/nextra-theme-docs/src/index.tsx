import type { NextraThemeLayoutProps, PageMapItem, PageOpts } from 'nextra'
import type { ReactElement, ReactNode } from 'react'

import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import 'focus-visible'
import cn from 'clsx'
import { MDXProvider, useMDXComponents } from 'nextra/mdx'
import { useMounted } from 'nextra/hooks'
import { useData } from 'nextra/data'

import './polyfill'
import {
  Head,
  NavLinks,
  Sidebar,
  SkipNavContent,
  Breadcrumb,
  Banner
} from './components'
import { getComponents } from './mdx-components'
import { ActiveAnchorProvider, ConfigProvider, useConfig } from './contexts'
import { DEFAULT_LOCALE, PartialDocsThemeConfig } from './constants'
import { getFSRoute, normalizePages, renderComponent } from './utils'
import { PageTheme } from './types'

function useDirectoryInfo(pageMap: PageMapItem[]) {
  const { locale = DEFAULT_LOCALE, defaultLocale, asPath } = useRouter()

  return useMemo(() => {
    // asPath can return redirected url
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
  breadcrumb: ReactNode
  timestamp?: number
  navigation: ReactNode
  children: ReactNode
}

const Body = ({
  themeContext,
  breadcrumb,
  timestamp,
  navigation,
  children
}: BodyProps): ReactElement => {
  const config = useConfig()
  const mounted = useMounted()

  if (themeContext.layout === 'raw') {
    return <div className="nx-w-full nx-overflow-x-hidden">{children}</div>
  }

  const date =
    themeContext.timestamp && config.gitTimestamp && timestamp
      ? new Date(timestamp)
      : null

  const gitTimestampEl =
    // Because a user's time zone may be different from the server page
    mounted && date ? (
      <div className="nx-mt-12 nx-mb-8 nx-block nx-text-xs nx-text-gray-500 ltr:nx-text-right rtl:nx-text-left dark:nx-text-gray-400">
        {renderComponent(config.gitTimestamp, { timestamp: date })}
      </div>
    ) : (
      <div className="nx-mt-16" />
    )

  const content = (
    <>
      {children}
      {gitTimestampEl}
      {navigation}
    </>
  )

  const body = config.main?.({ children: content }) || content

  if (themeContext.layout === 'full') {
    return (
      <article className="nextra-content nx-min-h-[calc(100vh-4rem)] nx-w-full nx-overflow-x-hidden nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]">
        {body}
      </article>
    )
  }

  return (
    <article
      className={cn(
        'nextra-content nx-flex nx-min-h-[calc(100vh-4rem)] nx-w-full nx-min-w-0 nx-max-w-full nx-justify-center nx-pb-8 nx-pr-[calc(env(safe-area-inset-right)-1.5rem)]',
        themeContext.typesetting === 'article' &&
          'nextra-body-typesetting-article'
      )}
    >
      <main className="nx-w-full nx-min-w-0 nx-max-w-4xl nx-px-6 nx-pt-4 md:nx-px-8">
        {breadcrumb}
        {body}
      </main>
    </article>
  )
}

const tocClassName = cn(
  'nextra-toc nx-order-last nx-hidden nx-w-64 nx-shrink-0 xl:nx-block'
)

const InnerLayout = ({
  filePath,
  pageMap,
  frontMatter,
  headings,
  timestamp,
  children
}: PageOpts & { children: ReactNode }): ReactElement => {
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

  const themeContext = { ...activeThemeContext, ...frontMatter }
  const hideSidebar =
    !themeContext.sidebar ||
    themeContext.layout === 'raw' ||
    activeType === 'page'

  const tocEl =
    activeType === 'page' ||
    !themeContext.toc ||
    themeContext.layout !== 'default' ? (
      themeContext.layout !== 'full' &&
      themeContext.layout !== 'raw' && (
        <nav className={tocClassName} aria-label="table of contents" />
      )
    ) : (
      <nav
        className={cn(tocClassName, 'nx-px-4')}
        aria-label="table of contents"
      >
        {renderComponent(config.toc.component, {
          headings: config.toc.float ? headings : [],
          filePath
        })}
      </nav>
    )

  const { locale = DEFAULT_LOCALE } = useRouter()
  const localeConfig = config.i18n.find(l => l.locale === locale)
  const isRTL = localeConfig
    ? localeConfig.direction === 'rtl'
    : config.direction === 'rtl'

  const direction = isRTL ? 'rtl' : 'ltr'

  return (
    // This makes sure that selectors like `[dir=ltr] .nextra-container` work
    // before hydration as Tailwind expects the `dir` attribute to exist on the
    // `html` element.
    <div dir={direction}>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('dir','${direction}')`
        }}
      />
      <Head />
      <Banner />
      {themeContext.navbar &&
        renderComponent(config.navbar.component, {
          flatDirectories,
          items: topLevelNavbarItems
        })}
      <div
        className={cn(
          'nx-mx-auto nx-flex',
          themeContext.layout !== 'raw' && 'nx-max-w-[90rem]'
        )}
      >
        <ActiveAnchorProvider>
          <Sidebar
            docsDirectories={docsDirectories}
            flatDirectories={flatDirectories}
            fullDirectories={directories}
            headings={headings}
            asPopover={hideSidebar}
            includePlaceholder={themeContext.layout === 'default'}
          />
          {tocEl}
          <SkipNavContent />
          <Body
            themeContext={themeContext}
            breadcrumb={
              activeType !== 'page' && themeContext.breadcrumb ? (
                <Breadcrumb activePath={activePath} />
              ) : null
            }
            timestamp={timestamp}
            navigation={
              activeType !== 'page' && themeContext.pagination ? (
                <NavLinks
                  flatDirectories={flatDocsDirectories}
                  currentIndex={activeIndex}
                />
              ) : null
            }
          >
            <MDXProvider
              components={getComponents({
                isRawLayout: themeContext.layout === 'raw',
                components: config.components
              })}
            >
              {children}
            </MDXProvider>
          </Body>
        </ActiveAnchorProvider>
      </div>
      {renderComponent(config.footer.component, { menu: hideSidebar })}
    </div>
  )
}

export default function Layout({
  children,
  ...context
}: NextraThemeLayoutProps): ReactElement {
  return (
    <ConfigProvider value={context}>
      <InnerLayout {...context.pageOpts}>{children}</InnerLayout>
    </ConfigProvider>
  )
}

export { useConfig, PartialDocsThemeConfig as DocsThemeConfig }
export { useMDXComponents }
export { useTheme } from 'next-themes'
export {
  Bleed,
  Callout,
  Collapse,
  NotFoundPage,
  ServerSideErrorPage,
  Tabs,
  Tab,
  Navbar,
  SkipNavContent,
  SkipNavLink,
  ThemeSwitch
} from './components'
