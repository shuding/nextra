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

type TopLevelNavbarItems = ReturnType<
  typeof normalizePages
>['topLevelNavbarItems']

type Config = {
  hideSidebar: boolean
  normalizePagesResult: ReturnType<typeof normalizePages>
  setTopLevelNavbarItems: (items: TopLevelNavbarItems) => void
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
    normalizePagesResult: state.normalizePagesResult,
    setTopLevelNavbarItems: state.setTopLevelNavbarItems
  }))

function getStore(list: PageMapItem[], route: string) {
  const normalizePagesResult = normalizePages({ list, route })
  const { activeThemeContext, activeType } = normalizePagesResult
  return createStore<Config>(set => ({
    normalizePagesResult,
    hideSidebar:
      !activeThemeContext.sidebar ||
      activeType === 'page' ||
      activeType === undefined /* non mdx pages */,
    setTopLevelNavbarItems: (items: TopLevelNavbarItems) =>
      set(state => ({
        ...state,
        normalizePagesResult: {
          ...state.normalizePagesResult,
          topLevelNavbarItems: items
        }
      }))
  }))
}

export const ConfigProvider: FC<{
  children: ReactNode
  pageMap: PageMapItem[]
  navbar: ReactElement
  footer: ReactElement
}> = ({ children, pageMap, navbar, footer }) => {
  const pathname = useFSRoute()

  const [store] = useState(() => getStore(pageMap, pathname))

  useEffect(() => {
    store.setState(getStore(pageMap, pathname).getState())
  }, [store, pageMap, pathname])

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
