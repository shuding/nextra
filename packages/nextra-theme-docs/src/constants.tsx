/* eslint sort-keys: error */
import React, { isValidElement, FC, ReactNode } from 'react'
import { PageTheme } from './types'
import { useRouter } from 'next/router'
import { Anchor, Flexsearch, Footer, Navbar, TOC } from './components'
import { DiscordIcon, GitHubIcon } from 'nextra/icons'
import { MatchSorterSearch } from './components/match-sorter-search'
import { useConfig } from './contexts'
import { getGitEditUrl, getGitIssueUrl, Item } from './utils'
import { z } from 'zod'
import { NavBarProps } from './components/navbar'
import { TOCProps } from './components/toc'
import { NextSeoProps } from 'next-seo'

export const DEFAULT_LOCALE = 'en-US'

export const IS_BROWSER = typeof window !== 'undefined'

function isReactNode(value: unknown): boolean {
  return isString(value) || isValidElement(value as any) || isFunction(value)
}

function isFunction(value: unknown): boolean {
  return typeof value === 'function'
}

function isString(value: unknown): boolean {
  return typeof value === 'string'
}

const i18nSchema = z.array(
  z.object({
    direction: z.string().optional(),
    locale: z.string(),
    text: z.string()
  })
)

const reactNode = [
  isReactNode,
  { message: 'Must be React.ReactNode or React.FC' }
] as const
const fc = [isFunction, { message: 'Must be React.FC' }] as const

export const themeSchema = z
  .object({
    banner: z.object({
      dismissible: z.boolean(),
      key: z.string(),
      text: z.custom<ReactNode | FC>(...reactNode).optional()
    }),
    chat: z.object({
      icon: z.custom<ReactNode | FC>(...reactNode),
      link: z.string().startsWith('https://').optional()
    }),
    components: z.record(z.custom<FC>(...fc)).optional(),
    darkMode: z.boolean(),
    direction: z.enum(['ltr', 'rtl']),
    docsRepositoryBase: z.string().startsWith('https://'),
    editLink: z.object({
      component: z.custom<
        FC<{
          children: ReactNode
          className?: string
          filePath?: string
        }>
      >(...fc),
      text: z.custom<ReactNode | FC>(...reactNode)
    }),
    faviconGlyph: z.string().optional(),
    feedback: z.object({
      content: z.custom<ReactNode | FC>(...reactNode),
      labels: z.string(),
      useLink: z.function().returns(z.string())
    }),
    footer: z.object({
      component: z.custom<ReactNode | FC<{ menu: boolean }>>(...reactNode),
      text: z.custom<ReactNode | FC>(...reactNode)
    }),
    gitTimestamp: z.custom<ReactNode | FC<{ timestamp: Date }>>(...reactNode),
    head: z.custom<ReactNode | FC>(...reactNode),
    i18n: i18nSchema,
    logo: z.custom<ReactNode | FC>(...reactNode),
    logoLink: z.boolean().or(z.string()),
    main: z.custom<FC<{ children: ReactNode }>>(...fc).optional(),
    navbar: z.object({
      component: z.custom<ReactNode | FC<NavBarProps>>(...reactNode),
      extraContent: z.custom<ReactNode | FC>(...reactNode).optional()
    }),
    navigation: z.boolean().or(
      z.object({
        next: z.boolean(),
        prev: z.boolean()
      })
    ),
    nextThemes: z.object({
      defaultTheme: z.string(),
      forcedTheme: z.string().optional(),
      storageKey: z.string()
    }),
    notFound: z.object({
      content: z.custom<ReactNode | FC>(...reactNode),
      labels: z.string()
    }),
    primaryHue: z.number().or(
      z.object({
        dark: z.number(),
        light: z.number()
      })
    ),
    project: z.object({
      icon: z.custom<ReactNode | FC>(...reactNode),
      link: z.string().startsWith('https://').optional()
    }),
    search: z.object({
      component: z.custom<
        ReactNode | FC<{ className?: string; directories: Item[] }>
      >(...reactNode),
      emptyResult: z.custom<ReactNode | FC>(...reactNode),
      loading: z.string().or(z.function().returns(z.string())),
      // Can't be React component
      placeholder: z.string().or(z.function().returns(z.string()))
    }),
    serverSideError: z.object({
      content: z.custom<ReactNode | FC>(...reactNode),
      labels: z.string()
    }),
    sidebar: z.object({
      defaultMenuCollapseLevel: z.number().min(2).int(),
      titleComponent: z.custom<ReactNode | FC<{ title: string; type: string }>>(
        ...reactNode
      )
    }),
    toc: z.object({
      component: z.custom<ReactNode | FC<TOCProps>>(...reactNode),
      extraContent: z.custom<ReactNode | FC>(...reactNode),
      float: z.boolean(),
      title: z.custom<ReactNode | FC>(...reactNode)
    }),
    useNextSeoProps: z.custom<() => NextSeoProps>(isFunction)
  })
  .strict()

const publicThemeSchema = themeSchema.deepPartial().extend({
  // to have `locale` and `text` as required properties
  i18n: i18nSchema,
})

export type DocsThemeConfig = z.infer<typeof themeSchema>
export type PartialDocsThemeConfig = z.infer<typeof publicThemeSchema>

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
    component({ className, filePath, children }) {
      const editUrl = getGitEditUrl(filePath)
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
  gitTimestamp({ timestamp }) {
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
  project: {
    icon: (
      <>
        <GitHubIcon />
        <span className="nx-sr-only">GitHub</span>
      </>
    )
  },
  search: {
    component({ className, directories }) {
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
    loading() {
      const { locale } = useRouter()
      if (locale === 'zh-CN') return '正在加载…'
      if (locale === 'ru') return 'Загрузка…'
      if (locale === 'fr') return 'Сhargement…'
      return 'Loading…'
    },
    placeholder() {
      const { locale } = useRouter()
      if (locale === 'zh-CN') return '搜索文档…'
      if (locale === 'ru') return 'Поиск документации…'
      if (locale === 'fr') return 'Rechercher de la documentation…'
      return 'Search documentation…'
    }
  },
  serverSideError: {
    content: 'Submit an issue about error in url →',
    labels: 'bug'
  },
  sidebar: {
    defaultMenuCollapseLevel: 2,
    titleComponent: ({ title }) => <>{title}</>
  },
  toc: {
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

export const DEFAULT_PAGE_THEME: PageTheme = {
  breadcrumb: true,
  collapsed: false,
  footer: true,
  layout: 'default',
  navbar: true,
  pagination: true,
  sidebar: true,
  timestamp: true,
  toc: true,
  typesetting: 'default'
}
