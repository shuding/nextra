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
    key: 'nextra-banner',
    text: ''
  },
  chat: {
    icon: (
      <>
        <DiscordIcon />
        <span className="sr-only">Discord</span>
      </>
    ),
    link: ''
  },
  components: {},
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
  faviconGlyph: '',
  feedback: {
    content: null,
    labels: ''
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
      <span className="mr-2 hidden font-extrabold md:inline">Nextra</span>
      <span className="hidden font-normal text-gray-600 md:inline">
        The Next Docs Builder
      </span>
    </>
  ),
  main: {
    extraContent: null
  },
  navbar: {
    component: Navbar,
    extraContent: null
  },
  navigation: {
    next: true,
    prev: true
  },
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
        <span className="sr-only">GitHub</span>
      </>
    ),
    // by default should be empty so clicking on project link will go to the github link
    link: ''
  },
  search: {
    component({ className, directories }) {
      const config = useConfig()
      return config.unstable_flexsearch ? (
        <Flexsearch className={className} />
      ) : (
        <MatchSorterSearch className={className} directories={directories} />
      )
    },
    emptyResult: (
      <span className="block select-none p-8 text-center text-sm text-gray-400">
        No results found.
      </span>
    ),
    placeholder() {
      const { locale } = useRouter()
      if (locale === 'zh-CN') return '搜索文档...'
      return 'Search documentation...'
    }
  },
  serverSideError: {
    content: 'Submit an issue about error in url →',
    labels: 'bug'
  },
  sidebar: {
    defaultMenuCollapsed: false,
    titleComponent: ({ title }) => <>{title}</>
  },
  titleSuffix: ' – Nextra',
  toc: {
    component: TOC,
    extraContent: null,
    float: true,
    title: 'On This Page'
  }
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
  bodyExtraContent: 'main.extraContent',
  customSearch: 'search.component',
  defaultMenuCollapsed: 'sidebar.defaultMenuCollapsed',
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
  footer: true,
  layout: 'default',
  navbar: true,
  pagination: true,
  sidebar: true,
  timestamp: true,
  toc: true,
  typesetting: 'default'
}
