/* eslint sort-keys: error */
import React from 'react'
import { DocsThemeConfig, PageTheme } from './types'
import { useRouter } from 'next/router'
import { Flexsearch, Footer, TOC } from './components'
import { DiscordIcon, GitHubIcon } from 'nextra/icons'
import { MatchSorterSearch } from './components/match-sorter-search'
import { useConfig } from './contexts'

export const DEFAULT_LOCALE = 'en-US'

export const IS_BROWSER = typeof window !== 'undefined'

export const META_FILENAME = '_meta.json'

export const DEFAULT_THEME: DocsThemeConfig = {
  banner: {
    key: 'nextra-banner',
    text: ''
  },
  bodyExtraContent: null,
  components: {},
  darkMode: true,
  direction: 'ltr',
  docsRepositoryBase: 'https://github.com/shuding/nextra',
  editLinkText: 'Edit this page',
  feedback: {
    labels: '',
    link: null
  },
  // @TODO: Can probably introduce a set of options to use Google Fonts directly
  font: false,
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
  github: '',
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
  navigation: {
    next: true,
    prev: true
  },
  nextThemes: {
    defaultTheme: 'system',
    storageKey: 'theme'
  },
  notFound: {
    labels: 'bug',
    link: 'Submit an issue about broken link →'
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
  projectChat: {
    icon: (
      <>
        <DiscordIcon />
        <span className="sr-only">Discord</span>
      </>
    ),
    link: ''
  },
  search: {
    component({ directories }) {
      const config = useConfig()
      return config.unstable_flexsearch ? (
        <Flexsearch />
      ) : (
        <MatchSorterSearch directories={directories} />
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
    labels: 'bug',
    link: 'Submit an issue about error in url →'
  },
  sidebar: {
    defaultMenuCollapsed: false,
    subtitle: null
  },
  titleSuffix: ' – Nextra',
  toc: {
    component: TOC,
    extraContent: null,
    float: true,
    title: 'On This Page'
  },
  unstable_faviconGlyph: ''
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
