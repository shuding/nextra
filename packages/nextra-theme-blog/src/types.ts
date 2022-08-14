import { PageOpts } from 'nextra'
import React from 'react'

export interface NextraBlogTheme {
  readMore?: string
  footer?: React.ReactNode
  titleSuffix?: string
  tagTitle?: (props: { title: string; tag: string }) => string
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
  comments?: React.ReactNode
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
