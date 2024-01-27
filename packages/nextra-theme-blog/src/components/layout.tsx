import type { ReactElement, ReactNode } from 'react'
import { ThemeProvider } from './next-themes'
import '../style.css'

export function Footer({
  children = `CC BY-NC 4.0 ${new Date().getFullYear()} © Shu Ding.`
}: {
  children?: ReactNode
}): ReactElement {
  return <small className="_mt-32 _block">{children}</small>
}

export function Layout({ children }: { children: ReactNode }): ReactElement {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <article
        className="_container _prose max-md:_prose-sm dark:_prose-dark"
        dir="ltr"
      >
        {children}
      </article>
    </ThemeProvider>
  )
}
