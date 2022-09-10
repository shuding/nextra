/* eslint typescript-sort-keys/interface: error */
import { FC, ReactNode } from 'react'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { PageOpts } from 'nextra'
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
    key: string
    text: ReactNode | FC
  }
  main: {
    extraContent: ReactNode | FC
  }
  components: Record<string, FC>
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
  feedback: {
    labels: string
    content: ReactNode | FC
  }
  footer: {
    component: ReactNode | FC<{ menu: boolean }>
    text: ReactNode | FC
  }
  gitTimestamp: ReactNode | FC<{ timestamp: Date }>
  head: ReactNode | FC
  i18n: { direction?: string; locale: string; text: string }[]
  logo: ReactNode | FC
  navbar: ReactNode | FC<NavBarProps>
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
    labels: string
    link: ReactNode | FC
  }
  primaryHue:
    | number
    | {
        dark: number
        light: number
      }
  project: {
    icon: ReactNode | FC
    link: string
  }
  chat: {
    icon: ReactNode | FC
    link: string
  }
  search: {
    component:
      | ReactNode
      | FC<{
          className?: string
          directories: Item[]
        }>
    emptyResult: ReactNode | FC
    // Can't be React component
    placeholder: string | (() => string)
  }
  serverSideError: {
    labels: string
    link: ReactNode | FC
  }
  sidebar: {
    defaultMenuCollapsed: boolean
    titleComponent: ReactNode | FC<{ type: string; title: string }>
  }
  // Can't be React component, otherwise will get Warning: A title element received an array with more than 1 element as children.
  titleSuffix: string | (() => string)
  toc: {
    component: ReactNode | FC<TOCProps>
    extraContent: ReactNode | FC
    float: boolean
    title: ReactNode | FC
  }
  faviconGlyph: string
}

export type PageTheme = {
  breadcrumb: boolean
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
