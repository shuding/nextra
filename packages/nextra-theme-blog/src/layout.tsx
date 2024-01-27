import type { NextraThemeLayoutProps } from 'nextra'
import type { ReactElement, ReactNode } from 'react'
import { ThemeProvider } from './contexts'
import { Nav } from './nav'
import { ThemeConfigProvider } from './theme-config'
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
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <article
        className="_container _prose max-md:_prose-sm dark:_prose-dark"
        dir="ltr"
      >
        <ThemeConfigProvider
          value={{
            readMore: 'Read More →',
            ...themeConfig
          }}
        >
          <div className="_mb-8 _flex _items-center _gap-3">
            <Nav />
          </div>
          {children}
        </ThemeConfigProvider>
      </article>
    </ThemeProvider>
  )
}
