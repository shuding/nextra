import type { NextraThemeLayoutProps } from 'nextra'
import type { ReactElement, ReactNode } from 'react'
import { ThemeProvider } from './contexts'
import { ThemeConfigProvider } from './theme-config'

export function Footer({
  children = `CC BY-NC 4.0 ${new Date().getFullYear()} © Shu Ding.`
}: {
  children?: ReactNode
}): ReactElement {
  return <small className="_mt-32 _block">{children}</small>
}

export function Layout({ children, themeConfig }: NextraThemeLayoutProps) {
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
        <ThemeConfigProvider value={config}>{children}</ThemeConfigProvider>
      </article>
    </ThemeProvider>
  )
}
