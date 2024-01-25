'use client'

import 'focus-visible'
import '../polyfill'
import type { ReactElement, ReactNode } from 'react'
import { ActiveAnchorProvider, useConfig, useThemeConfig } from '../contexts'
import { renderComponent } from '../utils'

export function InnerLayout({
  children
}: {
  children: ReactNode
}): ReactElement {
  const themeConfig = useThemeConfig()
  const { normalizePagesResult, hideSidebar } = useConfig()

  const { activeThemeContext: themeContext, topLevelNavbarItems } =
    normalizePagesResult

  return (
    <>
      {themeContext.navbar &&
        renderComponent(themeConfig.navbar.component, {
          items: topLevelNavbarItems
        })}
      <ActiveAnchorProvider>{children}</ActiveAnchorProvider>
      {themeContext.footer &&
        renderComponent(themeConfig.footer.component, {
          menu: hideSidebar
        })}
    </>
  )
}
