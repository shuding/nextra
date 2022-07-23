import React from 'react'
import { ThemeProviderProps } from 'next-themes/dist/types'

export interface DocsThemeConfig {
  projectLink?: string
  github?: string
  projectLinkIcon?: React.ReactNode | React.FC<{ locale?: string }>
  docsRepositoryBase?: string
  titleSuffix?:
    | React.ReactNode
    | React.FC<{
        locale: string
        config: DocsThemeConfig
        title: string
        meta: Meta
      }>
  nextLinks?: boolean
  prevLinks?: boolean
  search?: boolean
  darkMode?: boolean
  nextThemes?: Pick<
    ThemeProviderProps,
    'defaultTheme' | 'storageKey' | 'forcedTheme'
  >
  defaultMenuCollapsed?: boolean
  font?: boolean
  footer?: boolean
  footerText?:
    | React.ReactNode
    | React.FC<{
        locale?: string
      }>
  footerEditLink?:
    | React.ReactNode
    | React.FC<{
        locale?: string
      }>
  logo?:
    | React.ReactNode
    | React.FC<{
        locale?: string
      }>
  head?:
    | React.ReactNode
    | React.FC<{
        locale: string
        config: DocsThemeConfig
        title: string
        meta: Meta
      }>
  direction?: 'ltr' | 'rtl'
  i18n?: { locale: string; text: string; direction: string }[]
  floatTOC?: boolean
  unstable_faviconGlyph?: string
  feedbackLink?:
    | React.ReactNode
    | React.FC<{
        locale?: string
      }>
  feedbackLabels?: string
  customSearch?: React.ReactNode | false
  searchPlaceholder?: string | ((props: { locale?: string }) => string)
  projectChatLink?: string
  projectChatLinkIcon?: React.FC<{ locale?: string }>
  sidebarSubtitle?: React.FC<{ title: string }>
  banner?: React.FC<{ locale?: string }>
  bannerKey?: string
  gitTimestamp?: string | React.FC<{ locale?: string; timestamp: Date }>
  tocExtraContent?: React.FC<{ locale?: string }>
  unstable_searchResultEmpty?:
    | React.ReactNode
    | React.FC<{
        locale?: string
      }>
}

export type PageTheme = {
  navbar: boolean
  sidebar: boolean
  toc: boolean
  pagination: boolean
  footer: boolean
  layout: 'default' | 'full' | 'raw'
  typesetting: 'default' | 'article'
  breadcrumb: boolean
}
export interface Meta extends PageTheme {
  title: string
}
