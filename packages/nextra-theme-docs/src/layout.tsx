import { ThemeProvider } from 'next-themes'
import type { NextraThemeLayoutProps } from 'nextra'
import { Search } from 'nextra/components'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { isValidElement } from 'react'
import { Footer, MobileNav, Navbar } from './components'
import {
  ActiveAnchorProvider,
  ConfigProvider,
  ThemeConfigProvider
} from './contexts'
import type { DocsThemeConfig } from './contexts/theme-config'

const DEFAULT_THEME: DocsThemeConfig = {
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
  navigation: true,
  search: <Search />,
  sidebar: {
    defaultMenuCollapseLevel: 2,
    toggleButton: true
  },
  themeSwitch: {
    options: {
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

type ThemeProviderProps = Omit<ComponentProps<typeof ThemeProvider>, 'children'>

export function Layout({
  children,
  themeConfig,
  pageMap,
  nextThemes,
  footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>,
  navbar = <Navbar />
}: NextraThemeLayoutProps & {
  nextThemes?: ThemeProviderProps
  footer?: ReactNode
  navbar?: ReactNode
}): ReactElement {
  const extendedThemeConfig = {
    ...DEFAULT_THEME,
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
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
        defaultTheme="system"
        storageKey="theme"
        {...nextThemes}
      >
        <ConfigProvider pageMap={pageMap} footer={footer} navbar={navbar}>
          <ActiveAnchorProvider>
            <MobileNav />
            {children}
          </ActiveAnchorProvider>
        </ConfigProvider>
      </ThemeProvider>
    </ThemeConfigProvider>
  )
}
