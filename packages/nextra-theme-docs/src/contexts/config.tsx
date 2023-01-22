import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState
} from 'react'
import { PageOpts, PageMapItem } from 'nextra'
import { ThemeProvider } from 'next-themes'
import { Context } from '../types'
import {
  DEEP_OBJECT_KEYS,
  DEFAULT_THEME,
  DocsThemeConfig,
  pageThemeSchema,
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

function normalizeZodMessage(error: unknown): string {
  return (error as ZodError).issues
    .map(issue => {
      const themePath =
        issue.path.length > 0 ? `Path: "${issue.path.join('.')}"` : ''
      return `${issue.message}. ${themePath}`
    })
    .join('\n')
}

function validateMeta(pageMap: PageMapItem[]) {
  for (const pageMapItem of pageMap) {
    if (pageMapItem.kind === 'Meta') {
      for (const [key, data] of Object.entries(pageMapItem.data)) {
        const hasTheme = data && typeof data === 'object' && 'theme' in data
        if (!hasTheme) continue

        try {
          pageThemeSchema.parse(data.theme)
        } catch (error) {
          console.error(
            `[nextra-theme-docs] Error validating "theme" config in _meta.json file for "${key}" page.\n\n${normalizeZodMessage(
              error
            )}`
          )
        }
      }
    } else if (pageMapItem.kind === 'Folder') {
      validateMeta(pageMapItem.children)
    }
  }
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
      theme = themeSchema.parse(theme)
    } catch (error) {
      console.error(
        `[nextra-theme-docs] Error validating theme config file.\n\n${normalizeZodMessage(
          error
        )}`
      )
    }
    validateMeta(pageOpts.pageMap)
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
