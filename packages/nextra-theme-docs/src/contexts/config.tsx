import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState
} from 'react'
import { PageOpts } from 'nextra'
import { ThemeProvider } from 'next-themes'
import { Context } from '../types'
import {
  DEEP_OBJECT_KEYS,
  DEFAULT_THEME,
  DocsThemeConfig,
  themeSchema
} from '../constants'
import { MenuProvider } from './menu'
import type { ZodError } from 'zod'

type Config = DocsThemeConfig &
  Pick<PageOpts, 'flexsearch' | 'newNextLinkBehavior' | 'title' | 'frontMatter'>

const ConfigContext = createContext<Config>({
  title: '',
  frontMatter: {},
  ...DEFAULT_THEME
})

export const useConfig = () => useContext(ConfigContext)

let theme: DocsThemeConfig
let isValidated = process.env.NODE_ENV === 'production'

function lowerCaseFirstLetter(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

export const ConfigProvider = ({
  children,
  value: { themeConfig, pageOpts }
}: {
  children: ReactNode
  value: Context
}): ReactElement => {
  const [menu, setMenu] = useState(false)
  // Merge only on first load
  theme ||= {
    ...DEFAULT_THEME,
    ...Object.fromEntries(
      Object.entries(themeConfig).map(([key, value]) => [
        key,
        value && typeof value === 'object' && DEEP_OBJECT_KEYS.includes(key)
          ? // @ts-expect-error -- key has always object value
            { ...DEFAULT_THEME[key], ...value }
          : value
      ])
    )
  }
  if (!isValidated) {
    try {
      theme = themeSchema.parse(theme, {
        errorMap: err => {
          return {
            message: 'Invalid theme config'
          }
        }
      })
    } catch (err) {
      console.error('[nextra] Error validating the theme config')
      console.error(
        (err as ZodError).issues
          .map(
            issue =>
              '[nextra] Error in config `' +
              issue.path.join('.') +
              '`: ' +
              lowerCaseFirstLetter(issue.message || '')
          )
          .join('\n')
      )
    }
    isValidated = true
  }
  const extendedConfig: Config = {
    ...theme,
    flexsearch: pageOpts.flexsearch,
    ...(typeof pageOpts.newNextLinkBehavior === 'boolean' && {
      newNextLinkBehavior: pageOpts.newNextLinkBehavior
    }),
    title: pageOpts.title,
    frontMatter: pageOpts.frontMatter
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
