import React, { ReactNode } from 'react'
import { BasicLayout } from './basic-layout'
import Nav from './nav'

export const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <BasicLayout>
      <Nav />
      {children}
    </BasicLayout>
  )
}
