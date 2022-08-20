import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState
} from 'react'
import { PageOpts } from 'nextra'
import { ThemeProvider } from 'next-themes'
import { Context, DocsThemeConfig } from '../types'
import { DEFAULT_THEME } from '../constants'
import { MenuProvider } from './menu'

type Config = DocsThemeConfig &
  Pick<
    PageOpts,
    'unstable_flexsearch' | 'newNextLinkBehavior' | 'title' | 'meta'
  >

const ConfigContext = createContext<Config>({
  title: '',
  meta: {},
  ...DEFAULT_THEME
})

export const useConfig = () => useContext(ConfigContext)

const DEEP_OBJECT_KEYS = [
  'banner',
  'feedback',
  'footer',
  'navigation',
  'nextThemes',
  'notFound',
  'project',
  'projectChat',
  'search',
  'serverSideError',
  'sidebar',
  'toc'
] as const

export const ConfigProvider = ({
  children,
  value
}: {
  children: ReactNode
  value: Context
}): ReactElement => {
  const [menu, setMenu] = useState(false)
  const { themeConfig, pageOpts } = value
  const extendedConfig: Config = {
    ...DEFAULT_THEME,
    ...themeConfig,
    unstable_flexsearch: pageOpts.unstable_flexsearch,
    newNextLinkBehavior: pageOpts.newNextLinkBehavior,
    title: pageOpts.title,
    meta: pageOpts.meta,
    ...Object.fromEntries(
      DEEP_OBJECT_KEYS.map(key => [
        key,
        { ...DEFAULT_THEME[key], ...themeConfig[key] }
      ])
    )
  }

  const { nextThemes } = extendedConfig

  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme={nextThemes.defaultTheme}
      storageKey={nextThemes.storageKey}
      forcedTheme={nextThemes.forcedTheme}
    >
      <ConfigContext.Provider value={extendedConfig}>
        <MenuProvider value={{ menu, setMenu }}>{children}</MenuProvider>
      </ConfigContext.Provider>
    </ThemeProvider>
  )
}
