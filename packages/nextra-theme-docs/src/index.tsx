'use client'

import 'focus-visible'
import './polyfill'
import { ThemeProvider } from 'next-themes'
import type { NextraThemeLayoutProps } from 'nextra'
import type { ReactElement, ReactNode } from 'react'
import { Banner, Head } from './components'
import {
  ActiveAnchorProvider,
  ConfigProvider,
  ThemeConfigProvider,
  useConfig,
  useThemeConfig
} from './contexts'
import { renderComponent } from './utils'

function InnerLayout({ children }: { children: ReactNode }): ReactElement {
  const themeConfig = useThemeConfig()

  const config = useConfig()

  const { activeThemeContext: themeContext, topLevelNavbarItems } =
    config.normalizePagesResult

  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      {...themeConfig.nextThemes}
    >
      <Head />
      <Banner />
      {themeContext.navbar &&
        renderComponent(themeConfig.navbar.component, {
          items: topLevelNavbarItems
        })}
      <ActiveAnchorProvider>{children}</ActiveAnchorProvider>
      {themeContext.footer &&
        renderComponent(themeConfig.footer.component, {
          menu: config.hideSidebar
        })}
    </ThemeProvider>
  )
}

export function Layout({
  children,
  themeConfig,
  pageOpts
}: NextraThemeLayoutProps): ReactElement {
  return (
    <ThemeConfigProvider value={themeConfig}>
      <ConfigProvider value={pageOpts}>
        <InnerLayout>{children}</InnerLayout>
      </ConfigProvider>
    </ThemeConfigProvider>
  )
}

export {
  useThemeConfig,
  useConfig
  // PartialDocsThemeConfig as DocsThemeConfig
}
export { useTheme } from 'next-themes'
export {
  Bleed,
  Collapse,
  NotFoundPage,
  Navbar,
  SkipNavContent,
  SkipNavLink,
  ThemeSwitch,
  LocaleSwitch,
  Link
} from './components'
