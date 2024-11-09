'use client'

import type { PageMapItem } from 'nextra'
import { useFSRoute } from 'nextra/hooks'
import { normalizePages } from 'nextra/normalize-pages'
import type { FC, ReactElement, ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { createStore } from 'zustand'
import type { StoreApi } from 'zustand'
import { shallow } from 'zustand/shallow'
import { useStoreWithEqualityFn } from 'zustand/traditional'

type Config = {
  hideSidebar: boolean
  normalizePagesResult: ReturnType<typeof normalizePages>
}

const ConfigContext = createContext<StoreApi<Config> | null>(null)

function useConfigStore<T>(selector: (state: Config) => T) {
  const store = useContext(ConfigContext)
  if (!store) {
    throw new Error('Missing ConfigContext.Provider')
  }
  return useStoreWithEqualityFn(store, selector, shallow)
}

export const useConfig = () =>
  useConfigStore(state => ({
    hideSidebar: state.hideSidebar,
    normalizePagesResult: state.normalizePagesResult
  }))

function getStore(list: PageMapItem[], route: string) {
  const normalizePagesResult = normalizePages({ list, route })
  const { activeThemeContext, activeType } = normalizePagesResult
  return {
    normalizePagesResult,
    hideSidebar:
      !activeThemeContext.sidebar ||
      activeType === 'page' ||
      activeType === undefined /* non mdx pages */
  }
}

export const ConfigProvider: FC<{
  children: ReactNode
  pageMap: PageMapItem[]
  navbar: ReactElement
  footer: ReactElement
}> = ({ children, pageMap, navbar, footer }) => {
  const pathname = useFSRoute()

  const [store] = useState(() =>
    createStore<Config>(() => getStore(pageMap, pathname))
  )

  useEffect(() => {
    store.setState(getStore(pageMap, pathname))
  }, [store, pageMap, pathname])

  const { activeThemeContext } = store.getState().normalizePagesResult

  return (
    <ConfigContext.Provider value={store}>
      {activeThemeContext.navbar && navbar}
      {children}
      {activeThemeContext.footer && footer}
    </ConfigContext.Provider>
  )
}
