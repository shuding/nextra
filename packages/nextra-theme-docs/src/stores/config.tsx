'use client'

import type { PageMapItem } from 'nextra'
import { useFSRoute } from 'nextra/hooks'
import { normalizePages } from 'nextra/normalize-pages'
import type { FC, ReactNode } from 'react'
import { createContext, useContext } from 'react'

type NormalizePagesResult = ReturnType<typeof normalizePages>

const ConfigContext = createContext<NormalizePagesResult | null>(null)

/**
 * Provides normalized data for the current page from `ConfigContext`.
 *
 * This includes the full result of `normalizePages`, along with a derived value `hideSidebar`
 * that determines whether the sidebar should be hidden on the current page.
 *
 * @returns An object containing the `normalizePagesResult` and a `hideSidebar` value.
 * @throws If used outside of a `ConfigContext.Provider`.
 */
export function useConfig(): {
  normalizePagesResult: NormalizePagesResult
  /**
   * Whether the sidebar is shown. If `false`, the theme and locale switchers are displayed in the
   * `<Footer>`.
   */
  hideSidebar: boolean
} {
  const normalizePagesResult = useContext(ConfigContext)
  if (!normalizePagesResult) {
    throw new Error('Missing ConfigContext.Provider')
  }
  const { activeThemeContext, activeType } = normalizePagesResult
  return {
    normalizePagesResult,
    hideSidebar: !activeThemeContext.sidebar || activeType === 'page'
  }
}

export const ConfigProvider: FC<{
  children: ReactNode
  pageMap: PageMapItem[]
  navbar: ReactNode
  footer: ReactNode
}> = ({ children, pageMap, navbar, footer }) => {
  const pathname = useFSRoute()

  const normalizedPages = normalizePages({
    list: pageMap,
    route: pathname
  })
  const { activeThemeContext } = normalizedPages

  return (
    <ConfigContext.Provider value={normalizedPages}>
      {activeThemeContext.navbar && navbar}
      {children}
      {activeThemeContext.footer && footer}
    </ConfigContext.Provider>
  )
}
