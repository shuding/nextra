import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { PageOpts } from 'nextra'
import { useRouter } from 'next/router'
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
  meta: {}
})

export const useConfig = () => useContext(ConfigContext)

export const ConfigProvider = ({
  children,
  value
}: {
  children: ReactNode
  value: Context
}): ReactElement => {
  const [menu, setMenu] = useState(false)
  const { themeConfig, pageOpts } = value
  const extendedConfig = {
    ...DEFAULT_THEME,
    ...themeConfig,
    unstable_flexsearch: pageOpts.unstable_flexsearch,
    newNextLinkBehavior: pageOpts.newNextLinkBehavior,
    title: pageOpts.title,
    meta: pageOpts.meta
  }
  const nextThemes = extendedConfig.nextThemes || {}

  const { locale } = useRouter()
  const { i18n, direction } = extendedConfig

  useEffect(() => {
    if (typeof document === 'undefined') return
    let isRTL: boolean
    if (i18n) {
      const localeConfig = i18n.find(l => l.locale === locale)
      isRTL = !!localeConfig && localeConfig.direction === 'rtl'
    } else {
      isRTL = direction === 'rtl'
    }
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  }, [i18n, direction])

  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme={nextThemes.defaultTheme}
      storageKey={nextThemes.storageKey}
      forcedTheme={nextThemes.forcedTheme}
    >
      <ConfigContext.Provider value={extendedConfig}>
        <MenuProvider
          value={{
            menu,
            setMenu,
            defaultMenuCollapsed: !!extendedConfig.defaultMenuCollapsed
          }}
        >
          {children}
        </MenuProvider>
      </ConfigContext.Provider>
    </ThemeProvider>
  )
}
