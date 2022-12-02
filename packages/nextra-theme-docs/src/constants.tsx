/* eslint sort-keys: error */
import React, { isValidElement } from 'react'
import { DocsThemeConfig, PageTheme } from './types'
import { useRouter } from 'next/router'
import { Anchor, Flexsearch, Footer, Navbar, TOC } from './components'
import { DiscordIcon, GitHubIcon } from 'nextra/icons'
import { MatchSorterSearch } from './components/match-sorter-search'
import { useConfig } from './contexts'
import { getGitEditUrl } from './utils'

export const DEFAULT_LOCALE = 'en-US'

export const IS_BROWSER = typeof window !== 'undefined'

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
    content: () => <>Question? Give us feedback →</>,
    labels: 'feedback'
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
        {timestamp.toLocaleDateString(locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
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
  .filter(Boolean) as (keyof DocsThemeConfig)[]

export const LEGACY_CONFIG_OPTIONS: Record<string, string> = {
  bannerKey: 'banner.key',
  bodyExtraContent: 'main',
  customSearch: 'search.component',
  defaultMenuCollapsed: 'sidebar.defaultMenuCollapseLevel',
  feedbackLabels: 'feedback.labels',
  feedbackLink: 'feedback.content',
  floatTOC: 'toc.float',
  footerEditLink: 'editLink.text',
  footerText: 'footer.text',
  github: 'project.link',
  nextLinks: 'navigation.next',
  notFoundLabels: 'notFound.labels',
  notFoundLink: 'notFound.content',
  prevLinks: 'navigation.prev',
  projectChat: 'chat',
  projectChatLink: 'chat.link',
  projectChatLinkIcon: 'chat.icon',
  projectLink: 'project.link',
  projectLinkIcon: 'project.icon',
  searchPlaceholder: 'search.placeholder',
  serverSideErrorLabels: 'serverSideError.labels',
  serverSideErrorLink: 'serverSideError.content',
  sidebarSubtitle: 'sidebar.titleComponent',
  tocExtraContent: 'toc.extraContent',
  unstable_searchResultEmpty: 'search.emptyResult'
}

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
