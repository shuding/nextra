import type { NextraThemeLayoutProps } from 'nextra'
import { DiscordIcon, GitHubIcon } from 'nextra/icons'
import type { ReactElement, ReactNode } from 'react'
import { isValidElement } from 'react'
import { Flexsearch, Footer, InnerLayout } from './components'
import type { ThemeProviderProps } from './contexts'
import { ConfigProvider, ThemeConfigProvider, ThemeProvider } from './contexts'
import type { DocsThemeConfig } from './contexts/theme-config'

const DEFAULT_THEME: DocsThemeConfig = {
  chat: {
    icon: (
      <>
        <DiscordIcon />
        <span className="_sr-only">Discord</span>
      </>
    )
  },
  darkMode: true,
  docsRepositoryBase: 'https://github.com/shuding/nextra',
  editLink: {
    content: 'Edit this page'
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback'
  },
  i18n: [],
  logo: (
    <>
      <span className="_font-extrabold">Nextra</span>
      <span className="_ml-2 max-md:_hidden _font-normal _text-gray-600">
        The Next Docs Builder
      </span>
    </>
  ),
  logoLink: true,
  navigation: true,
  navbar: {},
  project: {
    icon: (
      <>
        <GitHubIcon />
        <span className="_sr-only">GitHub</span>
      </>
    )
  },
  search: <Flexsearch />,
  sidebar: {
    defaultMenuCollapseLevel: 2,
    toggleButton: true
  },
  themeSwitch: {
    useOptions: {
      dark: 'Dark',
      light: 'Light',
      system: 'System'
    }
  },
  toc: {
    backToTop: true,
    float: true,
    title: 'On This Page'
  }
}

const DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME)
  .map(([key, value]) => {
    const isObject =
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !isValidElement(value)
    if (isObject) {
      return key
    }
  })
  .filter(Boolean)

export function Layout({
  children,
  themeConfig,
  pageOpts,
  banner,
  nextThemes,
  footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>
}: NextraThemeLayoutProps & {
  banner?: ReactNode
  nextThemes?: ThemeProviderProps
  footer?: ReactNode
}): ReactElement {
  const date = pageOpts.timestamp ? new Date(pageOpts.timestamp) : null
  const extendedThemeConfig = {
    ...DEFAULT_THEME,
    gitTimestamp: date && (
      <>
        Last updated on{' '}
        <time dateTime={date.toISOString()}>
          {date.toLocaleDateString('en', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </time>
      </>
    ),
    ...(themeConfig &&
      Object.fromEntries(
        Object.entries(themeConfig).map(([key, value]) => [
          key,
          value && typeof value === 'object' && DEEP_OBJECT_KEYS.includes(key)
            ? // @ts-expect-error -- key has always object value
              { ...DEFAULT_THEME[key], ...value }
            : value
        ])
      ))
  }

  return (
    <ThemeConfigProvider value={extendedThemeConfig}>
      <ConfigProvider value={pageOpts}>
        {banner}
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          defaultTheme="system"
          storageKey="theme"
          {...nextThemes}
        >
          <InnerLayout footer={footer}>{children}</InnerLayout>
        </ThemeProvider>
      </ConfigProvider>
    </ThemeConfigProvider>
  )
}
