/* eslint typescript-sort-keys/interface: error */
import { ReactNode } from 'react'
import { PageOpts } from 'nextra'
import { DocsThemeConfig } from './constants'

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
  pageOpts: PageOpts
  themeConfig: DocsThemeConfig
}

export type SearchResult = {
  children: ReactNode
  id: string
  prefix?: ReactNode
  route: string
}
