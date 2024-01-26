import type { NextraThemeLayoutProps } from 'nextra'
import { DEFAULT_THEME } from './constants'
import { ClientLayout } from './layout.client'
import { ThemeProvider } from './next-themes'
import type { BlogFrontMatter } from './types'

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
