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
import {
  DEEP_OBJECT_KEYS,
  DEFAULT_THEME,
  LEGACY_CONFIG_OPTIONS
} from '../constants'
import { MenuProvider } from './menu'

type Config = DocsThemeConfig &
  Pick<PageOpts, 'flexsearch' | 'newNextLinkBehavior' | 'title' | 'frontMatter'>

const ConfigContext = createContext<Config>({
  title: '',
  frontMatter: {},
  ...DEFAULT_THEME
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
  const extendedConfig: Config = {
    ...DEFAULT_THEME,
    ...themeConfig,
    flexsearch: pageOpts.flexsearch,
    newNextLinkBehavior: pageOpts.newNextLinkBehavior,
    title: pageOpts.title,
    frontMatter: pageOpts.frontMatter,
    ...Object.fromEntries(
      DEEP_OBJECT_KEYS.map(key =>
        typeof themeConfig[key] === 'object'
          ? [
              key,
              // @ts-expect-error -- key has always object value
              { ...DEFAULT_THEME[key], ...themeConfig[key] }
            ]
          : []
      )
    )
  }

  const { nextThemes } = extendedConfig

  if (process.env.NODE_ENV === 'development') {
    const notice = '[nextra-theme-docs] ⚠️  You are using a legacy theme config'

    for (const [legacyOption, newPath] of Object.entries(
      LEGACY_CONFIG_OPTIONS
    )) {
      if (legacyOption in themeConfig) {
        const [obj, key] = newPath.split('.')
        const renameTo = key ? `${obj}: { ${key}: ... }` : obj
        console.warn(
          `${notice} \`${legacyOption}\`. Rename it to \`${renameTo}\` for future compatibility.`
        )
      }
    }

    for (const key of ['search', 'footer'] as const) {
      if (key in themeConfig) {
        const option = themeConfig[key]
        if (typeof option === 'boolean' || option == null) {
          console.warn(
            `${notice} \`${key}\`.`,
            option
              ? 'Remove it'
              : `Rename it to \`${key}: { component: null }\` for future compatibility.`
          )
        }
      }
    }
    if (typeof themeConfig.banner === 'string') {
      console.warn(
        notice,
        '`banner`. Rename it to `banner: { content: ... }` for future compatibility.'
      )
    }
  }

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
