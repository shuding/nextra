import React from 'react'
import { DocsThemeConfig, PageTheme } from './types'

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
  searchPlaceholder({ locale }) {
    if (locale === 'zh-CN') return '搜索文档...'
    return 'Search documentation...'
  },
  unstable_searchResultEmpty: (
    <span className="block select-none p-8 text-center text-sm text-gray-400">
      No results found.
    </span>
  ),
  bannerKey: 'nextra-banner',
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
