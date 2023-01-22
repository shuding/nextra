/* eslint typescript-sort-keys/interface: error */
import type { ReactNode } from 'react'
import type { PageOpts } from 'nextra'
import type { DocsThemeConfig } from './constants'

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
