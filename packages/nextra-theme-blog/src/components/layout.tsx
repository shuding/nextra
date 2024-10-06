import { ThemeProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes/dist/types'
import { ViewTransitions } from 'next-view-transitions'
import type { ReactElement, ReactNode } from 'react'

export function Footer({
  children = `CC BY-NC 4.0 ${new Date().getFullYear()} © Shu Ding.`
}: {
  children?: ReactNode
}): ReactElement {
  return (
    <small className="_mt-32 _block" data-pagefind-ignore="all">
      {children}
    </small>
  )
}

export function Layout({
  children,
  nextThemes
}: {
  children: ReactNode
  nextThemes: Omit<ThemeProviderProps, 'children'>
}): ReactElement {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...nextThemes}
    >
      <article
        className="_container _px-4 _prose max-md:_prose-sm dark:_prose-invert"
        dir="ltr"
        data-pagefind-body
      >
        <ViewTransitions>{children}</ViewTransitions>
      </article>
    </ThemeProvider>
  )
}
