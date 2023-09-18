import { useRouter } from 'next/router'
import type { NextraThemeLayoutProps, PageOpts } from 'nextra'
import type { ReactElement, ReactNode } from 'react'
import { useMemo } from 'react'
import 'focus-visible'
import cn from 'clsx'
import { useFSRoute, useMounted } from 'nextra/hooks'
import { MDXProvider } from 'nextra/mdx'
import './polyfill'
import type { PageTheme } from 'nextra/normalize-pages'
import { normalizePages } from 'nextra/normalize-pages'
import {
  Banner,
  Breadcrumb,
  Head,
  NavLinks,
  Sidebar,
  SkipNavContent
} from './components'
import { DEFAULT_LOCALE, PartialDocsThemeConfig } from './constants'
import { ActiveAnchorProvider, ConfigProvider, useConfig } from './contexts'
import { getComponents } from './mdx-components'
import { renderComponent } from './utils'

interface BodyProps {
  themeContext: PageTheme
  breadcrumb: ReactNode
  timestamp?: number
  navigation: ReactNode
  children: ReactNode
}

const classes = {
  toc: cn(
    'nextra-toc x-order-last x-hidden x-w-64 x-shrink-0 xl:x-block print:x-hidden'
  ),
  main: cn('x-w-full x-break-words')
}

function Body({
  themeContext,
  breadcrumb,
  timestamp,
  navigation,
  children
}: BodyProps): ReactElement {
  const config = useConfig()
  const mounted = useMounted()

  if (themeContext.layout === 'raw') {
    return <div className={classes.main}>{children}</div>
  }

  const date =
    themeContext.timestamp && config.gitTimestamp && timestamp
      ? new Date(timestamp)
      : null

  const gitTimestampEl =
    // Because a user's time zone may be different from the server page
    mounted && date ? (
      <div className="x-mt-12 x-mb-8 x-block x-text-xs x-text-gray-500 ltr:x-text-right rtl:x-text-left dark:x-text-gray-400">
        {renderComponent(config.gitTimestamp, { timestamp: date })}
      </div>
    ) : (
      <div className="x-mt-16" />
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
      <article
        className={cn(
          classes.main,
          'nextra-content _min-h-[calc(100vh-var(--nextra-navbar-height))] _pl-[max(env(safe-area-inset-left),1.5rem)] _pr-[max(env(safe-area-inset-right),1.5rem)]'
        )}
      >
        {body}
      </article>
    )
  }

  return (
    <article
      className={cn(
        classes.main,
        'nextra-content _flex _min-h-[calc(100vh-var(--nextra-navbar-height))] _min-w-0 _justify-center _pb-8 _pr-[calc(env(safe-area-inset-right)-1.5rem)]',
        themeContext.typesetting === 'article' &&
          'nextra-body-typesetting-article'
      )}
    >
      <main className="_w-full _min-w-0 _max-w-6xl _px-6 _pt-4 md:_px-12">
        {breadcrumb}
        {body}
      </main>
    </article>
  )
}

function InnerLayout({
  filePath,
  pageMap,
  frontMatter,
  toc,
  timestamp,
  children
}: PageOpts & { children: ReactNode }): ReactElement {
  const config = useConfig()
  const { locale = DEFAULT_LOCALE } = useRouter()
  const fsPath = useFSRoute()

  const {
    activeType,
    activeIndex,
    activeThemeContext,
    activePath,
    directories,
    docsDirectories,
    flatDocsDirectories,
    topLevelNavbarItems
  } = useMemo(
    () => normalizePages({ list: pageMap, route: fsPath }),
    [pageMap, fsPath]
  )

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
        <nav className={classes.toc} aria-label="table of contents" />
      )
    ) : (
      <nav className={cn(classes.toc, '_px-4')} aria-label="table of contents">
        {renderComponent(config.toc.component, {
          toc: config.toc.float ? toc : [],
          filePath
        })}
      </nav>
    )

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
          items: topLevelNavbarItems
        })}
      <div
        className={cn(
          '_mx-auto _flex',
          themeContext.layout !== 'raw' && '_max-w-[90rem]'
        )}
      >
        <ActiveAnchorProvider>
          <Sidebar
            docsDirectories={docsDirectories}
            fullDirectories={directories}
            toc={toc}
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
      {themeContext.footer &&
        renderComponent(config.footer.component, { menu: hideSidebar })}
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
export { useTheme } from 'next-themes'
export { Link } from './mdx-components'
export {
  Bleed,
  Collapse,
  NotFoundPage,
  ServerSideErrorPage,
  Navbar,
  SkipNavContent,
  SkipNavLink,
  ThemeSwitch,
  LocaleSwitch
} from './components'
