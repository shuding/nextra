'use client'

import { usePathname } from 'next/navigation'
import type { PageMapItem } from 'nextra'
import { normalizePages } from 'nextra/normalize-pages'
import type { ReactElement, ReactNode } from 'react'
import { Children, createContext, useContext, useEffect, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { shallow } from 'zustand/shallow'

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
  return useStore(store, selector, shallow)
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
    hideSidebar: !activeThemeContext.sidebar || activeType === 'page'
  }
}

export function ConfigProvider({
  children,
  pageMap
}: {
  children: ReactNode
  pageMap: PageMapItem[]
}): ReactElement {
  const pathname = usePathname()

  const [store] = useState(() =>
    createStore<Config>(() => getStore(pageMap, pathname))
  )

  useEffect(() => {
    store.setState(getStore(pageMap, pathname))
  }, [pageMap, pathname])

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
