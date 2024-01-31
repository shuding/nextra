'use client'

import 'focus-visible'
import '../polyfill'
import type { PageOpts } from 'nextra'
import { useFSRoute } from 'nextra/hooks'
import { normalizePages } from 'nextra/normalize-pages'
import type { ReactElement, ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { Sidebar } from '../components'
import { MenuProvider } from './menu'

type Config = {
  hideSidebar: boolean
  normalizePagesResult: ReturnType<typeof normalizePages>
}

const ConfigContext = createContext<Config>({
  hideSidebar: false,
  normalizePagesResult: {} as ReturnType<typeof normalizePages>
})
ConfigContext.displayName = 'Config'

export function useConfig() {
  return useContext(ConfigContext)
}

export function ConfigProvider({
  children,
  value: { pageMap },
  footer,
  navbar
}: {
  children: ReactNode
  value: PageOpts
  footer: ReactNode
  navbar: ReactNode
}): ReactElement {
  const [menu, setMenu] = useState(false)
  const fsPath = useFSRoute()

  const normalizePagesResult = useMemo(
    () => normalizePages({ list: pageMap, route: fsPath }),
    [pageMap, fsPath]
  )

  const { activeType, activeThemeContext, directories, docsDirectories } =
    normalizePagesResult
  const hideSidebar = !activeThemeContext.sidebar || activeType === 'page'

  const extendedConfig: Config = {
    hideSidebar,
    normalizePagesResult
  }

  const main = // @ts-expect-error -- fixme
    activeThemeContext.layout === 'raw' ? (
      children
    ) : (
      <div className="_mx-auto _flex _max-w-[90rem]">{children}</div>
    )

  return (
    <ConfigContext.Provider value={extendedConfig}>
      <MenuProvider value={{ menu, setMenu }}>
        {activeThemeContext.navbar && navbar}
        {main}
        {activeThemeContext.footer && footer}
      </MenuProvider>
    </ConfigContext.Provider>
  )
}
