/* eslint sort-keys: error */
import type { NextSeoProps } from 'next-seo'
import { useRouter } from 'next/router'
import { DiscordIcon, GitHubIcon } from 'nextra/icons'
import type { Item } from 'nextra/normalize-pages'
import type { FC, ReactNode } from 'react'
import { isValidElement } from 'react'
import { z } from 'zod'
import { Anchor, Flexsearch, Footer, Navbar, TOC } from './components'
import { MatchSorterSearch } from './components/match-sorter-search'
import type { NavBarProps } from './components/navbar'
import { themeOptionsSchema, ThemeSwitch } from './components/theme-switch'
import type { TOCProps } from './components/toc'
import { useConfig } from './contexts'
import { getGitIssueUrl, useGitEditUrl } from './utils'

export const DEFAULT_LOCALE = 'en-US'

export const IS_BROWSER = typeof window !== 'undefined'

function isReactNode(value: unknown): boolean {
  return (
    value == null ||
    typeof value === 'string' ||
    isFunction(value) ||
    isValidElement(value as any)
  )
}

function isFunction(value: unknown): boolean {
  return typeof value === 'function'
}

const i18nSchema = z.array(
  z.strictObject({
    direction: z.enum(['ltr', 'rtl']).optional(),
    locale: z.string(),
    text: z.string()
  })
)

const reactNode = [
  isReactNode,
  { message: 'Must be React.ReactNode or React.FC' }
] as const
const fc = [isFunction, { message: 'Must be React.FC' }] as const

export const themeSchema = z.strictObject({
  banner: z.strictObject({
    dismissible: z.boolean(),
    key: z.string(),
    text: z.custom<ReactNode | FC>(...reactNode).optional()
  }),
  chat: z.strictObject({
    icon: z.custom<ReactNode | FC>(...reactNode),
    link: z.string().startsWith('https://').optional()
  }),
  components: z.record(z.custom<FC>(...fc)).optional(),
  darkMode: z.boolean(),
  direction: z.enum(['ltr', 'rtl']),
  docsRepositoryBase: z.string().startsWith('https://'),
  editLink: z.strictObject({
    component: z
      .custom<
        FC<{
          children: ReactNode
          className?: string
          filePath?: string
        }>
      >(...fc)
      .or(z.null()),
    text: z.custom<ReactNode | FC>(...reactNode)
  }),
  faviconGlyph: z.string().optional(),
  feedback: z.strictObject({
    content: z.custom<ReactNode | FC>(...reactNode),
    labels: z.string(),
    useLink: z.function().returns(z.string())
  }),
  footer: z.strictObject({
    component: z.custom<ReactNode | FC<{ menu: boolean }>>(...reactNode),
    text: z.custom<ReactNode | FC>(...reactNode)
  }),
  gitTimestamp: z.custom<ReactNode | FC<{ timestamp: Date }>>(...reactNode),
  head: z.custom<ReactNode | FC>(...reactNode),
  i18n: i18nSchema,
  logo: z.custom<ReactNode | FC>(...reactNode),
  logoLink: z.boolean().or(z.string()),
  main: z.custom<FC<{ children: ReactNode }>>(...fc).optional(),
  navbar: z.strictObject({
    component: z.custom<ReactNode | FC<NavBarProps>>(...reactNode),
    extraContent: z.custom<ReactNode | FC>(...reactNode).optional()
  }),
  navigation: z.boolean().or(
    z.strictObject({
      next: z.boolean(),
      prev: z.boolean()
    })
  ),
  nextThemes: z.strictObject({
    defaultTheme: z.string(),
    forcedTheme: z.string().optional(),
    storageKey: z.string()
  }),
  notFound: z.strictObject({
    content: z.custom<ReactNode | FC>(...reactNode),
    labels: z.string()
  }),
  primaryHue: z.number().or(
    z.strictObject({
      dark: z.number(),
      light: z.number()
    })
  ),
  primarySaturation: z.number().or(
    z.strictObject({
      dark: z.number(),
      light: z.number()
    })
  ),
  project: z.strictObject({
    icon: z.custom<ReactNode | FC>(...reactNode),
    link: z.string().startsWith('https://').optional()
  }),
  search: z.strictObject({
    component: z.custom<
      ReactNode | FC<{ className?: string; directories: Item[] }>
    >(...reactNode),
    emptyResult: z.custom<ReactNode | FC>(...reactNode),
    error: z.string().or(z.function().returns(z.string())),
    loading: z.custom<ReactNode | FC>(...reactNode),
    // Can't be React component
    placeholder: z.string().or(z.function().returns(z.string()))
  }),
  serverSideError: z.strictObject({
    content: z.custom<ReactNode | FC>(...reactNode),
    labels: z.string()
  }),
  sidebar: z.strictObject({
    autoCollapse: z.boolean().optional(),
    defaultMenuCollapseLevel: z.number().min(1).int(),
    titleComponent: z.custom<
      ReactNode | FC<{ title: string; type: string; route: string }>
    >(...reactNode),
    toggleButton: z.boolean()
  }),
  themeSwitch: z.strictObject({
    component: z.custom<ReactNode | FC<{ lite?: boolean; className?: string }>>(
      ...reactNode
    ),
    useOptions: themeOptionsSchema.or(z.function().returns(themeOptionsSchema))
  }),
  toc: z.strictObject({
    backToTop: z.boolean(),
    component: z.custom<ReactNode | FC<TOCProps>>(...reactNode),
    extraContent: z.custom<ReactNode | FC>(...reactNode),
    float: z.boolean(),
    headingComponent: z
      .custom<FC<{ id: string; children: string }>>(...fc)
      .optional(),
    title: z.custom<ReactNode | FC>(...reactNode)
  }),
  useNextSeoProps: z.custom<() => NextSeoProps | void>(isFunction)
})

const publicThemeSchema = themeSchema.deepPartial().extend({
  // to have `locale` and `text` as required properties
  i18n: i18nSchema.optional()
})

export type DocsThemeConfig = z.infer<typeof themeSchema>
export type PartialDocsThemeConfig = z.infer<typeof publicThemeSchema>

const LOADING_LOCALES: Record<string, string> = {
  'en-US': 'Loading',
  fr: 'Сhargement',
  ru: 'Загрузка',
  'zh-CN': '正在加载'
}

const PLACEHOLDER_LOCALES: Record<string, string> = {
  'en-US': 'Search documentation',
  fr: 'Rechercher documents',
  ru: 'Поиск документации',
  'zh-CN': '搜索文档'
}

export const DEFAULT_THEME: DocsThemeConfig = {
  banner: {
    dismissible: true,
    key: 'nextra-banner'
  },
  chat: {
    icon: (
      <>
        <DiscordIcon />
        <span className="nx-sr-only">Discord</span>
      </>
    )
  },
  darkMode: true,
  direction: 'ltr',
  docsRepositoryBase: 'https://github.com/shuding/nextra',
  editLink: {
    component: function EditLink({ className, filePath, children }) {
      const editUrl = useGitEditUrl(filePath)
      if (!editUrl) {
        return null
      }
      return (
        <Anchor className={className} href={editUrl}>
          {children}
        </Anchor>
      )
    },
    text: 'Edit this page'
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback',
    useLink() {
      const config = useConfig()
      return getGitIssueUrl({
        labels: config.feedback.labels,
        repository: config.docsRepositoryBase,
        title: `Feedback for “${config.title}”`
      })
    }
  },
  footer: {
    component: Footer,
    text: `MIT ${new Date().getFullYear()} © Nextra.`
  },
  gitTimestamp: function GitTimestamp({ timestamp }) {
    const { locale = DEFAULT_LOCALE } = useRouter()
    return (
      <>
        Last updated on{' '}
        <time dateTime={timestamp.toISOString()}>
          {timestamp.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </time>
      </>
    )
  },
  head: (
    <>
      <meta name="msapplication-TileColor" content="#fff" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="description" content="Nextra: the next docs builder" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@shuding_" />
      <meta property="og:title" content="Nextra: the next docs builder" />
      <meta property="og:description" content="Nextra: the next docs builder" />
      <meta name="apple-mobile-web-app-title" content="Nextra" />
    </>
  ),
  i18n: [],
  logo: (
    <>
      <span className="nx-font-extrabold">Nextra</span>
      <span className="nx-ml-2 nx-hidden nx-font-normal nx-text-gray-600 md:nx-inline">
        The Next Docs Builder
      </span>
    </>
  ),
  logoLink: true,
  navbar: {
    component: Navbar
  },
  navigation: true,
  nextThemes: {
    defaultTheme: 'system',
    storageKey: 'theme'
  },
  notFound: {
    content: 'Submit an issue about broken link →',
    labels: 'bug'
  },
  primaryHue: {
    dark: 204,
    light: 212
  },
  primarySaturation: {
    dark: 100,
    light: 100
  },
  project: {
    icon: (
      <>
        <GitHubIcon />
        <span className="nx-sr-only">GitHub</span>
      </>
    )
  },
  search: {
    component: function Search({ className, directories }) {
      const config = useConfig()
      return config.flexsearch ? (
        <Flexsearch className={className} />
      ) : (
        <MatchSorterSearch className={className} directories={directories} />
      )
    },
    emptyResult: (
      <span className="nx-block nx-select-none nx-p-8 nx-text-center nx-text-sm nx-text-gray-400">
        No results found.
      </span>
    ),
    error: 'Failed to load search index.',
    loading: function useLoading() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter()
      const text =
        (locale && LOADING_LOCALES[locale]) || LOADING_LOCALES[defaultLocale]
      return <>{text}…</>
    },
    placeholder: function usePlaceholder() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter()
      const text =
        (locale && PLACEHOLDER_LOCALES[locale]) ||
        PLACEHOLDER_LOCALES[defaultLocale]
      return `${text}…`
    }
  },
  serverSideError: {
    content: 'Submit an issue about error in url →',
    labels: 'bug'
  },
  sidebar: {
    defaultMenuCollapseLevel: 2,
    titleComponent: ({ title }) => <>{title}</>,
    toggleButton: false
  },
  themeSwitch: {
    component: ThemeSwitch,
    useOptions() {
      const { locale } = useRouter()

      if (locale === 'zh-CN') {
        return { dark: '深色主题', light: '浅色主题', system: '系统默认' }
      }
      return { dark: 'Dark', light: 'Light', system: 'System' }
    }
  },
  toc: {
    backToTop: false,
    component: TOC,
    float: true,
    title: 'On This Page'
  },
  useNextSeoProps: () => ({ titleTemplate: '%s – Nextra' })
}

export const DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME)
  .map(([key, value]) => {
    const isObject =
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !isValidElement(value)
    if (isObject) {
      return key
    }
  })
  .filter(Boolean)
