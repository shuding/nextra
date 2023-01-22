import type { ReactNode } from 'react'
import { BasicLayout } from './basic-layout'
import { MDXTheme } from './mdx-theme'
import Nav from './nav'

export const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <BasicLayout>
      <Nav />
      <MDXTheme>{children}</MDXTheme>
    </BasicLayout>
  )
}
