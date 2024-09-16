'use client'

import type { Heading, PageMapItem } from 'nextra'
import { useFSRoute } from 'nextra/hooks'
import { normalizePages } from 'nextra/normalize-pages'
import type { ReactElement, ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { shallow } from 'zustand/shallow'

type Config = {
  hideSidebar: boolean
  normalizePagesResult: ReturnType<typeof normalizePages>
  toc: Heading[]
  actions: {
    setTOC: (toc: Heading[]) => void
  }
}

const ConfigContext = createContext<StoreApi<Config> | null>(null)

function useConfigStore<T>(selector: (state: Config) => T) {
  const store = useContext(ConfigContext)
  if (!store) {
    throw new Error('Missing ConfigContext.Provider')
  }
  return useStore(store, selector, shallow)
}

export const useConfig = () =>
  useConfigStore(state => ({
    hideSidebar: state.hideSidebar,
    normalizePagesResult: state.normalizePagesResult,
    toc: state.toc
  }))

export const useConfigActions = () => useConfigStore(state => state.actions)

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

  const [store] = useState(() => {
    const normalizePagesResult = normalizePages({
      list: pageMap,
      route: fsPath
    })
    const { activeThemeContext, activeType } = normalizePagesResult

    return createStore<Config>(set => ({
      hideSidebar: !activeThemeContext.sidebar || activeType === 'page',
      normalizePagesResult,
      toc: [],
      actions: {
        setTOC(toc) {
          set({ toc })
        }
      }
    }))
  })

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

  const { activeThemeContext } = store.getState().normalizePagesResult

  return (
    <ConfigContext.Provider value={store}>
      {activeThemeContext.navbar && navbar}
      {children}
      {activeThemeContext.footer && footer}
    </ConfigContext.Provider>
  )
}
