'use client'

import 'focus-visible'
import './polyfill'
import type { ReactElement, ReactNode } from 'react'
import { useConfig } from './contexts'

export function ClientLayout({
  children,
  footer,
  navbar
}: {
  children: ReactNode
  footer: ReactNode
  navbar: ReactNode
}): ReactElement {
  const { activeThemeContext } = useConfig().normalizePagesResult
  return (
    <>
      {activeThemeContext.navbar && navbar}
      {children}
      {activeThemeContext.footer && footer}
    </>
  )
}
