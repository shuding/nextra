import React from 'react'
import { Heading } from 'mdast'
export interface LoaderOptions {
  theme: Theme
  themeConfig: string
  locales: string[]
  defaultLocale: string
  unstable_stork: boolean
  unstable_staticImage: boolean
}

export interface PageMapItem {
  name: string
  route: string
  locale?: string
  children?: PageMapItem[]
  frontMatter?: Record<string, any>
  meta?: Record<string, any>
  active?: boolean
}

export interface PageOpt {
  filename: string
  route: string
  meta: Record<string, any>
  pageMap: PageMapItem[]
  titleText: string
  headings: Heading[]
}

export type Title = string | { [key: string]: string; title: string }

export type PageMapResult = [
  pageMap: PageMapItem[],
  route: string,
  title: Title
]

type Theme = string

export type NextraConfig = {
  theme: Theme
  themeConfig: string
  unstable_stork?: boolean
  unstable_staticImage?: boolean
}

export type withNextra = (
  ...args: [NextraConfig] | [theme: Theme, themeConfig: string]
) => (nextConfig: Record<string, any>) => {}

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
}

export default withNextra
