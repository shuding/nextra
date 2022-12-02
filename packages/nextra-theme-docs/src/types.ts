/* eslint typescript-sort-keys/interface: error */
import { FC, ReactNode } from 'react'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { PageOpts } from 'nextra'
import { NextSeoProps } from 'next-seo'
import { Item } from './utils'
import { TOCProps } from './components/toc'
import { NavBarProps } from './components/navbar'

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends FC // do not change properties for optional in FC type
    ? T[P]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P]
}

export interface DocsThemeConfig {
  banner: {
    dismissible: boolean
    key: string
    text?: ReactNode | FC
  }
  chat: {
    icon: ReactNode | FC
    link?: string
  }
  components?: Record<string, FC>
  darkMode: boolean
  direction: 'ltr' | 'rtl'
  docsRepositoryBase: string
  editLink: {
    component: FC<{
      children: ReactNode
      className?: string
      filePath?: string
    }>
    text: ReactNode | FC
  }
  faviconGlyph?: string
  feedback: {
    content?: ReactNode | FC
    labels?: string
  }
  footer: {
    component: ReactNode | FC<{ menu: boolean }>
    text: ReactNode | FC
  }
  gitTimestamp: ReactNode | FC<{ timestamp: Date }>
  head: ReactNode | FC
  i18n: { direction?: string; locale: string; text: string }[]
  logo: ReactNode | FC
  logoLink?: boolean | string
  main?: FC<{ children: ReactNode }>
  navbar: {
    component: ReactNode | FC<NavBarProps>
    extraContent?: ReactNode | FC
  }
  navigation:
    | boolean
    | {
        next: boolean
        prev: boolean
      }
  nextThemes: Pick<
    ThemeProviderProps,
    'defaultTheme' | 'storageKey' | 'forcedTheme'
  >
  notFound: {
    content: ReactNode | FC
    labels: string
  }
  primaryHue:
    | number
    | {
        dark: number
        light: number
      }
  project: {
    icon: ReactNode | FC
    link?: string
  }
  search: {
    component:
      | ReactNode
      | FC<{
          className?: string
          directories: Item[]
        }>
    emptyResult: ReactNode | FC
    loading: string | (() => string)
    // Can't be React component
    placeholder: string | (() => string)
  }
  serverSideError: {
    content: ReactNode | FC
    labels: string
  }
  sidebar: {
    defaultMenuCollapseLevel: number
    titleComponent: ReactNode | FC<{ title: string; type: string }>
  }
  toc: {
    component: ReactNode | FC<TOCProps>
    extraContent?: ReactNode | FC
    float: boolean
    title: ReactNode | FC
  }
  useNextSeoProps?: () => NextSeoProps
}

export type PageTheme = {
  breadcrumb: boolean
  collapsed: boolean
  footer: boolean
  layout: 'default' | 'full' | 'raw'
  navbar: boolean
  pagination: boolean
  sidebar: boolean
  timestamp: boolean
  toc: boolean
  typesetting: 'default' | 'article'
}

export type Context = {
  Content: FC
  pageOpts: PageOpts
  themeConfig: DocsThemeConfig
}

export type SearchResult = {
  children: ReactNode
  id: string
  prefix?: ReactNode
  route: string
}
