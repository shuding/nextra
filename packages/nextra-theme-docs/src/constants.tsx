import React from 'react'
import { DocsThemeConfig, PageTheme } from './types'
import { useRouter } from 'next/router'
import { Anchor } from './components'
import { getGitIssueUrl } from './utils/get-git-issue-url'
import useMounted from './utils/use-mounted'
import { useConfig } from './config'

export const DEFAULT_LOCALE = 'en-US'

export const IS_BROWSER = typeof window !== 'undefined'

export const DEFAULT_THEME: DocsThemeConfig = {
  projectLink: 'https://github.com/shuding/nextra',
  docsRepositoryBase: 'https://github.com/shuding/nextra',
  titleSuffix: ' – Nextra',
  nextLinks: true,
  prevLinks: true,
  search: true,
  darkMode: true,
  nextThemes: {
    defaultTheme: 'system',
    storageKey: 'theme'
  },
  defaultMenuCollapsed: false,
  // @TODO: Can probably introduce a set of options to use Google Fonts directly
  // font: true,
  footer: true,
  footerText: `MIT ${new Date().getFullYear()} © Nextra.`,
  footerEditLink: 'Edit this page',
  gitTimestamp: 'Last updated on',
  logo: (
    <>
      <span className="mr-2 hidden font-extrabold md:inline">Nextra</span>
      <span className="hidden font-normal text-gray-600 md:inline">
        The Next Docs Builder
      </span>
    </>
  ),
  head: (
    <>
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="description" content="Nextra: the next docs builder" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@shuding_" />
      <meta property="og:title" content="Nextra: the next docs builder" />
      <meta property="og:description" content="Nextra: the next docs builder" />
      <meta name="apple-mobile-web-app-title" content="Nextra" />
    </>
  ),
  searchPlaceholder() {
    const { locale } = useRouter()
    if (locale === 'zh-CN') return '搜索文档...'
    return 'Search documentation...'
  },
  unstable_searchResultEmpty: (
    <span className="block select-none p-8 text-center text-sm text-gray-400">
      No results found.
    </span>
  ),
  bannerKey: 'nextra-banner',
  notFoundLink() {
    const config = useConfig()
    const mounted = useMounted()
    const { asPath } = useRouter()
    return (
      <Anchor
        href={getGitIssueUrl({
          repository: config.docsRepositoryBase,
          title: `Found broken \`${mounted ? asPath : ''}\` link. Please fix!`,
          labels: config.notFoundLabels
        })}
        newWindow
      >
        Submit an issue about broken link.
      </Anchor>
    )
  },
  notFoundLabels: 'bug',
  serverSideErrorLink() {
    const config = useConfig()
    const mounted = useMounted()
    const { asPath } = useRouter()
    return (
      <Anchor
        href={getGitIssueUrl({
          repository: config.docsRepositoryBase,
          title: `Got server-side error in \`${
            mounted ? asPath : ''
          }\` url. Please fix!`,
          labels: config.serverSideErrorLabels
        })}
        newWindow
      >
        Submit an issue about error in url.
      </Anchor>
    )
  },
  serverSideErrorLabels: 'bug'
  // direction: 'ltr',
  // i18n: [{ locale: 'en-US', text: 'English', direction: 'ltr' }],
}

export const DEFAULT_PAGE_THEME: PageTheme = {
  navbar: true,
  sidebar: true,
  toc: true,
  pagination: true,
  footer: true,
  layout: 'default',
  typesetting: 'default',
  breadcrumb: true
}
