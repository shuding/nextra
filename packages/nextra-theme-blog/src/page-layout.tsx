import React, { ReactNode } from 'react'
import { BasicLayout } from './basic-layout'
import MDXTheme from './mdx-theme'
import Nav from './nav'
import { StaticTitle } from './title'

export const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <BasicLayout>
      <StaticTitle />
      <Nav />
      <MDXTheme>{children}</MDXTheme>
    </BasicLayout>
  )
}
