'use client'

import type { PageMapItem } from 'nextra'
import { useFSRoute } from 'nextra/hooks'
import { normalizePages } from 'nextra/normalize-pages'
import type { FC, ReactNode } from 'react'
import { Children, createContext, useContext, useEffect, useState } from 'react'
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
}> = ({ children, pageMap }) => {
  const pathname = useFSRoute()

  const [store] = useState(() =>
    createStore<Config>(() => getStore(pageMap, pathname))
  )

  useEffect(() => {
    store.setState(getStore(pageMap, pathname))
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

  const newChildren = Children.map(children, child => {
    if (
      child &&
      typeof child === 'object' &&
      'type' in child &&
      '_owner' in child &&
      child._owner
    ) {
      const ownerType = (child._owner as any).name
      if (ownerType === 'Footer') {
        return activeThemeContext.footer && child
      }
      if (ownerType === 'Navbar') {
        return activeThemeContext.navbar && child
      }
    }
    return child
  })

  return (
    <ConfigContext.Provider value={store}>{newChildren}</ConfigContext.Provider>
  )
}
