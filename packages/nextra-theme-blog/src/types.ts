import { PageOpts } from 'nextra'

export interface NextraBlogTheme {
  readMore?: string
  footer?: React.ReactNode
  titleSuffix?: string
  postFooter?: string
  head?: ({
    title,
    meta
  }: {
    title: string
    meta: Record<string, any>
  }) => React.ReactNode
  cusdis?: {
    appId: string
    host?: string
    lang: string
  }
  darkMode?: boolean
  navs?: {
    url: string
    name: string
  }[]
}

export interface BlogPageOpts extends PageOpts {
  meta: Meta
}

type Meta = {
  title?: string
  type?: 'post' | 'page' | 'posts' | 'tag'
  tag?: string | string[]
  back?: string
  date?: string
  description?: string
  author?: string
}

export interface LayoutProps {
  config: NextraBlogTheme
  opts: BlogPageOpts
}
