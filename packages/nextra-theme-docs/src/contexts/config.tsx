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
    'unstable_flexsearch' | 'newNextLinkBehavior' | 'title' | 'frontMatter'
  >

const ConfigContext = createContext<Config>({
  title: '',
  frontMatter: {},
  ...DEFAULT_THEME
})

export const useConfig = () => useContext(ConfigContext)

const DEEP_OBJECT_KEYS = [
  'banner',
  'editLink',
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

const LegacyOptions: Record<string, string> = {
  projectLink: 'project.link',
  projectLinkIcon: 'project.icon',
  nextLinks: 'navigation.next',
  prevLinks: 'navigation.prev',
  defaultMenuCollapsed: 'sidebar.defaultMenuCollapsed',
  footerText: 'footer.text',
  footerEditLink: 'editLink.text',
  floatTOC: 'toc.float',
  feedbackLink: 'feedback.link',
  feedbackLabels: 'feedback.labels',
  customSearch: 'search.component',
  searchPlaceholder: 'search.placeholder',
  projectChatLink: 'projectChat.link',
  projectChatLinkIcon: 'projectChat.icon',
  sidebarSubtitle: 'sidebar.subtitle',
  bannerKey: 'banner.key',
  tocExtraContent: 'toc.extraContent',
  unstable_searchResultEmpty: 'search.emptyResult',
  notFoundLink: 'notFound.link',
  notFoundLabels: 'notFound.labels',
  serverSideErrorLink: 'serverSideError.link',
  serverSideErrorLabels: 'serverSideError.labels'
}

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
    frontMatter: pageOpts.frontMatter,
    ...Object.fromEntries(
      DEEP_OBJECT_KEYS.map(key => [
        key,
        { ...DEFAULT_THEME[key], ...themeConfig[key] }
      ])
    )
  }

  const { nextThemes } = extendedConfig

  if (process.env.NODE_ENV === 'development') {
    const notice =
      '[nextra-theme-docs] ⚠️  You are using legacy theme config option'

    for (const [legacyOption, newPath] of Object.entries(LegacyOptions)) {
      if (legacyOption in themeConfig) {
        const [obj, key] = newPath.split('.')
        const renameTo = key ? `${obj}: { ${key}: ... }` : obj
        console.warn(`${notice} "${legacyOption}". Rename it to ${renameTo}`)
      }
    }

    for (const key of ['search', 'footer'] as const) {
      if (key in themeConfig) {
        const option = themeConfig[key]
        if (typeof option === 'boolean' || option == null) {
          console.warn(
            `${notice} "${key}".`,
            option ? 'Remove it' : `Rename it to ${key}: { component: null }`
          )
        }
      }
    }
    if (typeof themeConfig.banner === 'string') {
      console.warn(notice, '"banner". Rename it to banner: { text: ... }')
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
