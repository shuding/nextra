import { ThemeProvider } from 'next-themes'
import { ViewTransitions } from 'next-view-transitions'
import type { ComponentProps, FC, ReactNode } from 'react'

// Fix react compiler error Expression type `TemplateLiteral` cannot be safely reordered
const defaultChildren = `CC BY-NC 4.0 ${new Date().getFullYear()} © Shu Ding.`

export const Footer: FC<{
  children?: ReactNode
}> = ({ children = defaultChildren }) => {
  return (
    <small className="x:mt-32 x:block" data-pagefind-ignore="all">
      {children}
    </small>
  )
}

export const Layout: FC<{
  children: ReactNode
  nextThemes?: Omit<ComponentProps<typeof ThemeProvider>, 'children'>
  banner?: ReactNode
}> = ({ children, nextThemes, banner }) => {
  return (
    <ThemeProvider attribute="class" {...nextThemes}>
      {banner}
      <article
        className="x:container x:px-4 x:prose x:max-md:prose-sm x:dark:prose-invert"
        dir="ltr"
        data-pagefind-body
      >
        <ViewTransitions>{children}</ViewTransitions>
      </article>
    </ThemeProvider>
  )
}
