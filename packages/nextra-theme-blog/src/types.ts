/* eslint typescript-sort-keys/interface: error */
import { PageOpts } from 'nextra'
import { ReactNode } from 'react'

export interface NextraBlogTheme {
  comments?: ReactNode
  cusdis?: {
    appId: string
    host?: string
    lang: string
  }
  darkMode?: boolean
  footer?: ReactNode
  head?: ({
    meta,
    title,
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

export interface BlogPageOpts extends PageOpts {
  frontMatter: Meta
}

type Meta = {
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
  opts: BlogPageOpts
}
