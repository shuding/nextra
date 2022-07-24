import { NextConfig } from 'next'
import { Heading as MDASTHeading } from 'mdast'
import { ProcessorOptions } from '@mdx-js/mdx'
import { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'

export abstract class NextraPluginCache {
  public cache: { items: PageMapItem[]; fileMap: Record<string, any> } | null

  constructor() {
    this.cache = { items: [], fileMap: {} }
  }

  set(data: { items: PageMapItem[]; fileMap: Record<string, any> }) {
    this.cache!.items = data.items
    this.cache!.fileMap = data.fileMap
  }

  clear() {
    this.cache = null
  }

  get() {
    return this.cache
  }
}
export interface LoaderOptions extends NextraConfig {
  locales: string[]
  defaultLocale: string
  pageMapCache: NextraPluginCache
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
  unstable_flexsearch?:
    | boolean
    | {
        codeblocks: boolean
      }
}

export type PageMapResult = [
  pageMap: PageMapItem[],
  route: string,
  title: string
]

type Theme = string

export type NextraConfig = {
  theme: Theme
  themeConfig?: string
  unstable_flexsearch?: boolean | { codeblocks: boolean }
  unstable_staticImage?: boolean
  mdxOptions?: Pick<ProcessorOptions, 'rehypePlugins' | 'remarkPlugins'> & {
    rehypePrettyCodeOptions?: Partial<RehypePrettyCodeOptions>
  }
}

export type Nextra = (
  ...args: [NextraConfig] | [theme: Theme, themeConfig: string]
) => (nextConfig: NextConfig) => NextConfig

const nextra: Nextra =
  (...args) =>
  nextConfig => ({})

export default nextra
