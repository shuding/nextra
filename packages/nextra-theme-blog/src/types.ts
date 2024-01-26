/* eslint typescript-sort-keys/interface: error */
import type { PageOpts } from 'nextra'
import type { ReactNode } from 'react'

export interface NextraBlogTheme {
  darkMode?: boolean
  dateFormatter?: (date: Date) => string
  footer?: ReactNode
  navs?: {
    name: string
    url: string
  }[]
  readMore?: string
}

export type BlogFrontMatter = {
  author?: string
  date?: string
  description?: string
  tags: []
  title?: string
}

export interface LayoutProps {
  config: NextraBlogTheme
  opts: PageOpts<BlogFrontMatter>
}
