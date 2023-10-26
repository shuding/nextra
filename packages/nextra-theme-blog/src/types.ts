/* eslint typescript-sort-keys/interface: error */
import type { PageOpts } from 'nextra'
import type { MDXComponents } from 'nextra/mdx'
import type { ReactNode } from 'react'

export interface NextraBlogTheme {
  comments?: ReactNode
  components?: MDXComponents
  darkMode?: boolean
  dateFormatter?: (date: Date) => string
  footer?: ReactNode
  head?: ({
    meta,
    title
  }: {
    meta: Record<string, any>
    title: string
  }) => ReactNode
  navs?: {
    name: string
    url: string
  }[]
  postFooter?: string
  readMore?: string
  titleSuffix?: string
}

export type BlogFrontMatter = {
  author?: string
  back?: string
  date?: string
  description?: string
  tag?: string | string[]
  title?: string
  type?: 'post' | 'page' | 'posts' | 'tag'
}

export interface LayoutProps {
  config: NextraBlogTheme
  opts: PageOpts<BlogFrontMatter>
}
