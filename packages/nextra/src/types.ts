import { NextConfig } from 'next'
import { Heading as MDASTHeading } from 'mdast'
import { ProcessorOptions } from '@mdx-js/mdx'
import { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import { PageMapCache } from './plugin'

export interface LoaderOptions extends NextraConfig {
  locales: string[]
  defaultLocale: string
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
  themeConfig: string
  unstable_flexsearch?: boolean | { codeblocks: boolean }
  unstable_staticImage?: boolean
  mdxOptions?: Pick<ProcessorOptions, 'rehypePlugins' | 'remarkPlugins'> & {
    rehypePrettyCodeOptions?: Partial<RehypePrettyCodeOptions>
  }
}

export type Nextra = (
  ...args: [NextraConfig] | [theme: Theme, themeConfig: string]
) => (nextConfig: NextConfig) => NextConfig
