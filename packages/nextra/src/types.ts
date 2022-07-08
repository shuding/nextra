import { Heading as MDASTHeading } from 'mdast'
import { ProcessorOptions } from '@mdx-js/mdx'
import { PageMapCache } from './plugin'

export interface LoaderOptions {
  theme: Theme
  themeConfig: string
  locales: string[]
  defaultLocale: string
  unstable_staticImage: boolean
  unstable_flexsearch: boolean
  mdxOptions: Pick<
    ProcessorOptions,
    'rehypePlugins' | 'remarkPlugins' | 'jsx' | 'outputFormat'
  >
  pageMapCache: PageMapCache
}

export interface PageMapItem {
  name: string
  route: string
  locale?: string
  children?: PageMapItem[]
  timestamp?: number
  frontMatter?: Record<string, any>
  meta?: Record<string, any>
  active?: boolean
}

export type Heading = MDASTHeading & {
  value: string
}

export interface PageOpt {
  filename: string
  route: string
  meta: Record<string, any>
  pageMap: PageMapItem[]
  titleText: string | null
  headings?: Heading[]
  hasH1: boolean
}

export type PageMapResult = [
  pageMap: PageMapItem[],
  route: string,
  title: string
]

type Theme = string

export type NextraConfig = {
  theme: Theme
  themeConfig: string
  unstable_flexsearch: boolean
  unstable_staticImage?: boolean
}

export type withNextra = (
  ...args: [NextraConfig] | [theme: Theme, themeConfig: string]
) => (nextConfig: Record<string, any>) => {}

export default withNextra
