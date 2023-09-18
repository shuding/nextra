/* eslint sort-keys: error */
import { useRouter } from 'next/router'
import { DiscordIcon, GitHubIcon } from 'nextra/icons'
import { isValidElement } from 'react'
import type { z } from 'zod'
import {
  Anchor,
  Flexsearch,
  Footer,
  Navbar,
  ThemeSwitch,
  TOC
} from './components'
import { useConfig } from './contexts'
import type { publicThemeSchema, themeSchema } from './schemas'
import { getGitIssueUrl, useGitEditUrl } from './utils'

export const DEFAULT_LOCALE = 'en-US'

export const IS_BROWSER = typeof window !== 'undefined'

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
    content: 'Edit this page'
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
    content: `MIT ${new Date().getFullYear()} © Nextra.`
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
  head: null,
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
    component: Flexsearch,
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
    toggleButton: true
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
