'use client'

import '../polyfill'
import type { Heading, PageMapItem } from 'nextra'
import { useFSRoute } from 'nextra/hooks'
import { normalizePages } from 'nextra/normalize-pages'
import type { ReactElement, ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { MenuProvider } from './menu'

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
  const [menu, setMenu] = useState(false)
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
    // Lock background scroll when menu is opened
    document.body.classList.toggle('_overflow-hidden', menu)
  }, [menu])

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

  const value = useMemo(() => ({ menu, setMenu }), [menu])

  return (
    <ConfigContext.Provider value={extendedConfig}>
      <MenuProvider value={value}>
        {activeThemeContext.navbar && navbar}
        {children}
        {activeThemeContext.footer && footer}
      </MenuProvider>
    </ConfigContext.Provider>
  )
}
