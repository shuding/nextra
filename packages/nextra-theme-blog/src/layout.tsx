import type { NextraThemeLayoutProps } from 'nextra'
import type { ReactElement, ReactNode } from 'react'
import { ThemeProvider } from './contexts'
import { Nav } from './nav'
import { ThemeConfigProvider } from './theme-config'
import { ThemeSwitch } from './theme-switch'
import type { BlogFrontMatter } from './types'

export function Footer({
  children = `CC BY-NC 4.0 ${new Date().getFullYear()} © Shu Ding.`
}: {
  children?: ReactNode
}): ReactElement {
  return <small className="_mt-32 _block">{children}</small>
}

export function Layout({
  children,
  themeConfig
}: NextraThemeLayoutProps<BlogFrontMatter>) {
  const config = {
    readMore: 'Read More →',
    ...themeConfig
  }
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <article
        className="_container _prose max-md:_prose-sm dark:_prose-dark"
        dir="ltr"
      >
        <ThemeConfigProvider value={config}>
          <div className="_mb-8 _flex _items-center _gap-3">
            <div className="_flex _grow _flex-wrap _items-center _justify-end _gap-3">
              <Nav />
            </div>
            {config.darkMode && <ThemeSwitch />}
          </div>
          {children}
        </ThemeConfigProvider>
      </article>
    </ThemeProvider>
  )
}
