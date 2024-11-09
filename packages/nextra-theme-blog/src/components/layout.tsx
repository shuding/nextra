import { ThemeProvider } from 'next-themes'
import { ViewTransitions } from 'next-view-transitions'
import type { ComponentProps, FC, ReactElement, ReactNode } from 'react'

export const Footer: FC<{
  children?: ReactNode
}> = ({
  children = `CC BY-NC 4.0 ${new Date().getFullYear()} © Shu Ding.`
}) => {
  return (
    <small className="_mt-32 _block" data-pagefind-ignore="all">
      {children}
    </small>
  )
}

export const Layout: FC<{
  children: ReactNode
  nextThemes: Omit<ComponentProps<typeof ThemeProvider>, 'children'>
  banner?: ReactElement
}> = ({ children, nextThemes, banner }) => {
  return (
    <ThemeProvider attribute="class" {...nextThemes}>
      {banner}
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
