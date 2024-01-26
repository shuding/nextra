import type { NextraThemeLayoutProps } from 'nextra'
import type { ReactElement, ReactNode } from 'react'
import { DEFAULT_THEME } from './constants'
import { ClientLayout } from './layout.client'
import { ThemeProvider } from './next-themes'
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
  themeConfig,
  ...props
}: NextraThemeLayoutProps<BlogFrontMatter>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <article
        className="_container _prose max-md:_prose-sm dark:_prose-dark"
        dir="ltr"
      >
        <ClientLayout
          themeConfig={{ ...DEFAULT_THEME, ...themeConfig }}
          {...props}
        >
          {children}
        </ClientLayout>
      </article>
    </ThemeProvider>
  )
}
