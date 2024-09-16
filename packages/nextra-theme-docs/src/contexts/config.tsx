'use client'

import type { Heading, PageMapItem } from 'nextra'
import { useFSRoute } from 'nextra/hooks'
import { normalizePages } from 'nextra/normalize-pages'
import type { ReactElement, ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Config = {
  hideSidebar: boolean
  normalizePagesResult: ReturnType<typeof normalizePages>
  toc: Heading[]
  setTOC: (toc: Heading[]) => void
}

const ConfigContext = createContext<Config>({
  hideSidebar: false,
  normalizePagesResult: {} as ReturnType<typeof normalizePages>,
  toc: [],
  setTOC: () => {}
})
ConfigContext.displayName = 'Config'

export function useConfig() {
  return useContext(ConfigContext)
}

export function ConfigProvider({
  children,
  pageMap,
  footer,
  navbar
}: {
  children: ReactNode
  pageMap: PageMapItem[]
  footer: ReactNode
  navbar: ReactNode
}): ReactElement {
  const fsPath = useFSRoute()

  const normalizePagesResult = useMemo(
    () => normalizePages({ list: pageMap, route: fsPath }),
    [pageMap, fsPath]
  )

  const { activeType, activeThemeContext } = normalizePagesResult
  const hideSidebar = !activeThemeContext.sidebar || activeType === 'page'

  const [toc, setTOC] = useState<Heading[]>([])

  const extendedConfig: Config = {
    hideSidebar,
    normalizePagesResult,
    toc,
    setTOC
  }

  useEffect(() => {
    let resizeTimer: number

    function addResizingClass() {
      document.body.classList.add('resizing')
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        document.body.classList.remove('resizing')
      }, 200)
    }

    window.addEventListener('resize', addResizingClass)
    return () => {
      window.removeEventListener('resize', addResizingClass)
    }
  }, [])

  return (
    <ConfigContext.Provider value={extendedConfig}>
      {activeThemeContext.navbar && navbar}
      {children}
      {activeThemeContext.footer && footer}
    </ConfigContext.Provider>
  )
}
