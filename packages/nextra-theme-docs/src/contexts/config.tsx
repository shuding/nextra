import { useRouter } from 'next/router'
import type { FrontMatter, PageOpts } from 'nextra'
import { useFSRoute } from 'nextra/hooks'
import { normalizePages } from 'nextra/normalize-pages'
import type { ReactElement, ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { MenuProvider } from './menu'

type Config<FrontMatterType = FrontMatter> = Pick<
  PageOpts<FrontMatterType>,
  'title' | 'frontMatter' | 'filePath' | 'timestamp'
> & {
  hideSidebar: boolean
  normalizePagesResult: ReturnType<typeof normalizePages>
}

const ConfigContext = createContext<Config>({
  title: '',
  frontMatter: {},
  filePath: '',
  hideSidebar: false,
  normalizePagesResult: {} as ReturnType<typeof normalizePages>
})
ConfigContext.displayName = 'Config'

export function useConfig<FrontMatterType = FrontMatter>() {
  // @ts-expect-error TODO: fix Type 'Config<{ [key: string]: any; }>' is not assignable to type 'Config<FrontMatterType>'.
  return useContext<Config<FrontMatterType>>(ConfigContext)
}

export function ConfigProvider({
  children,
  value: pageOpts
}: {
  children: ReactNode
  value: PageOpts
}): ReactElement {
  const [menu, setMenu] = useState(false)
  const { asPath } = useRouter()

  const fsPath = useFSRoute()

  const normalizePagesResult = useMemo(
    () => normalizePages({ list: pageOpts.pageMap, route: fsPath }),
    [pageOpts.pageMap, fsPath]
  )

  const { activeType, activeThemeContext: themeContext } = normalizePagesResult

  const extendedConfig: Config = {
    title: pageOpts.title,
    frontMatter: pageOpts.frontMatter,
    filePath: pageOpts.filePath,
    timestamp: pageOpts.timestamp,
    hideSidebar:
      !themeContext.sidebar ||
      themeContext.layout === 'raw' ||
      activeType === 'page',
    normalizePagesResult
  }

  // Always close mobile nav when route was changed (e.g. logo click)
  useEffect(() => {
    setMenu(false)
  }, [asPath])

  return (
    <ConfigContext.Provider value={extendedConfig}>
      <MenuProvider value={{ menu, setMenu }}>{children}</MenuProvider>
    </ConfigContext.Provider>
  )
}
