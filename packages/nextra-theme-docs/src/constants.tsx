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
import { useConfig, useThemeConfig } from './contexts'
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
  backgroundColor: {
    dark: '17,17,17',
    light: '250,250,250'
  },
  banner: {
    dismissible: true,
    key: 'nextra-banner'
  },
  chat: {
    icon: (
      <>
        <DiscordIcon />
        <span className="_sr-only">Discord</span>
      </>
    )
  },
  color: {
    hue: {
      dark: 204,
      light: 212
    },
    saturation: 100
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
      const themeConfig = useThemeConfig()
      return getGitIssueUrl({
        labels: themeConfig.feedback.labels,
        repository: themeConfig.docsRepositoryBase,
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
  head: function useHead() {
    const { frontMatter, title: pageTitle } = useConfig()

    const title = `${pageTitle} – Nextra`
    const { description, canonical, image } = frontMatter
    return (
      <>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {description && (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
          </>
        )}
        {canonical && <link rel="canonical" href={canonical} />}
        {image && <meta name="og:image" content={image} />}
      </>
    )
  },
  i18n: [],
  logo: (
    <>
      <span className="_font-extrabold">Nextra</span>
      <span className="_ml-2 max-md:_hidden _font-normal _text-gray-600">
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
  project: {
    icon: (
      <>
        <GitHubIcon />
        <span className="_sr-only">GitHub</span>
      </>
    )
  },
  search: {
    component: Flexsearch,
    emptyResult: (
      <span className="_block _select-none _p-8 _text-center _text-sm _text-gray-400">
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
    backToTop: true,
    component: TOC,
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
  .filter(Boolean)
