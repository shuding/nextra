import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'
import type { FrontMatter, PageMapItem, PageOpts } from 'nextra'
import { useFSRoute } from 'nextra/hooks'
import { normalizePages } from 'nextra/normalize-pages'
import { metaSchema } from 'nextra/schemas'
import type { ReactElement, ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ZodError } from 'zod'
import type { DocsThemeConfig } from '../constants'
import { DEEP_OBJECT_KEYS, DEFAULT_THEME } from '../constants'
import { themeSchema } from '../schemas'
import type { Context } from '../types'
import { MenuProvider } from './menu'

type Config<FrontMatterType = FrontMatter> = DocsThemeConfig &
  Pick<
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
  normalizePagesResult: {} as ReturnType<typeof normalizePages>,
  ...DEFAULT_THEME
})
ConfigContext.displayName = 'Config'

export function useConfig<FrontMatterType = FrontMatter>() {
  // @ts-expect-error TODO: fix Type 'Config<{ [key: string]: any; }>' is not assignable to type 'Config<FrontMatterType>'.
  return useContext<Config<FrontMatterType>>(ConfigContext)
}

let theme: DocsThemeConfig
let isValidated = false

function normalizeZodMessage(error: unknown): string {
  return (error as ZodError).issues
    .flatMap(issue => {
      const themePath =
        issue.path.length > 0 && `Path: "${issue.path.join('.')}"`
      const unionErrors =
        'unionErrors' in issue ? issue.unionErrors.map(normalizeZodMessage) : []
      return [
        [issue.message, themePath].filter(Boolean).join('. '),
        ...unionErrors
      ]
    })
    .join('\n')
}

function _validateMeta(pageMap: PageMapItem[]) {
  for (const pageMapItem of pageMap) {
    if ('data' in pageMapItem) {
      for (const [key, data] of Object.entries(pageMapItem.data)) {
        try {
          metaSchema.parse(data)
        } catch (error) {
          console.error(
            `[nextra-theme-docs] Error validating _meta.json file for "${key}" property.\n\n${normalizeZodMessage(
              error
            )}`
          )
        }
      }
    } else if ('children' in pageMapItem) {
      _validateMeta(pageMapItem.children)
    }
  }
}

export function ConfigProvider({
  children,
  value: { themeConfig, pageOpts }
}: {
  children: ReactNode
  value: Context
}): ReactElement {
  const [menu, setMenu] = useState(false)
  const { asPath } = useRouter()
  // Merge only on first load
  theme ||= {
    ...DEFAULT_THEME,
    ...(themeConfig &&
      Object.fromEntries(
        Object.entries(themeConfig).map(([key, value]) => [
          key,
          value && typeof value === 'object' && DEEP_OBJECT_KEYS.includes(key)
            ? // @ts-expect-error -- key has always object value
              { ...DEFAULT_THEME[key], ...value }
            : value
        ])
      ))
  }
  if (process.env.NODE_ENV !== 'production' && !isValidated) {
    try {
      themeSchema.parse(theme)
    } catch (error) {
      console.error(
        `[nextra-theme-docs] Error validating theme config file.\n\n${normalizeZodMessage(
          error
        )}`
      )
    }
    // validateMeta(pageOpts.pageMap)
    isValidated = true
  }

  const fsPath = useFSRoute()

  const normalizePagesResult = useMemo(
    () => normalizePages({ list: pageOpts.pageMap, route: fsPath }),
    [pageOpts.pageMap, fsPath]
  )

  const { activeType, activeThemeContext: themeContext } = normalizePagesResult

  const extendedConfig: Config = {
    ...theme,
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

  const { nextThemes } = extendedConfig

  // Always close mobile nav when route was changed (e.g. logo click)
  useEffect(() => {
    setMenu(false)
  }, [asPath])

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
