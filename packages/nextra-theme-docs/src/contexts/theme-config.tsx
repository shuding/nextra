'use client'

/* eslint sort-keys: error */
import { DiscordIcon, GitHubIcon } from 'nextra/icons'
import type { ReactElement, ReactNode } from 'react'
import { createContext, isValidElement, useContext, useRef } from 'react'
import type { z } from 'zod'
import {
  Anchor,
  Flexsearch,
  Footer,
  Navbar,
  ThemeSwitch,
  TOC
} from '../components'
import type { publicThemeSchema, themeSchema } from '../schemas'
import { getGitIssueUrl, useGitEditUrl } from '../utils'
import { useConfig } from './config'

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
    return (
      <>
        Last updated on{' '}
        <time dateTime={timestamp.toISOString()}>
          {timestamp.toLocaleDateString('en', {
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
    loading: 'Loading…',
    placeholder: 'Search documentation…'
  },
  sidebar: {
    defaultMenuCollapseLevel: 2,
    toggleButton: true
  },
  themeSwitch: {
    component: ThemeSwitch,
    useOptions: {
      dark: 'Dark',
      light: 'Light',
      system: 'System'
    }
  },
  toc: {
    backToTop: false,
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

const ThemeConfigContext = createContext<DocsThemeConfig>(DEFAULT_THEME)
ThemeConfigContext.displayName = 'ThemeConfig'
export const useThemeConfig = () => useContext(ThemeConfigContext)

export function ThemeConfigProvider({
  value,
  children
}: {
  value: DocsThemeConfig
  children: ReactNode
}): ReactElement {
  const storeRef = useRef<DocsThemeConfig>()
  storeRef.current ||= {
    ...DEFAULT_THEME,
    ...(value &&
      Object.fromEntries(
        Object.entries(value).map(([key, value]) => [
          key,
          value && typeof value === 'object' && DEEP_OBJECT_KEYS.includes(key)
            ? // @ts-expect-error -- key has always object value
              { ...DEFAULT_THEME[key], ...value }
            : value
        ])
      ))
  }

  return (
    <ThemeConfigContext.Provider value={storeRef.current}>
      {children}
    </ThemeConfigContext.Provider>
  )
}
