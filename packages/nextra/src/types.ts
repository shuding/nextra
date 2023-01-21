import { NextConfig } from 'next'
import { Heading as MDASTHeading } from 'mdast'
import { ProcessorOptions } from '@mdx-js/mdx'
import { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import { GrayMatterFile } from 'gray-matter'
import { PageMapCache } from './plugin'
import {
  MARKDOWN_EXTENSIONS,
  META_FILENAME,
  NEXTRA_INTERNAL
} from './constants'
import { ReactNode, FC } from 'react'

type MetaFilename = typeof META_FILENAME
type MarkdownExtension = (typeof MARKDOWN_EXTENSIONS)[number]

export interface LoaderOptions extends NextraConfig {
  isMetaImport?: boolean
  isPageImport?: boolean
  locales: string[]
  defaultLocale: string
  pageMapCache: PageMapCache
  newNextLinkBehavior?: boolean
  distDir?: string
}

export interface Folder<FileType = PageMapItem> {
  kind: 'Folder'
  name: string
  route: string
  children: FileType[]
}

export type MetaJsonFile = {
  kind: 'Meta'
  locale?: string
  data: {
    [fileName: string]: Meta
  }
  // The path to the _meta.json file. This is a private property needed by the loader.
  __nextra_src?: string
}

export type FrontMatter = GrayMatterFile<string>['data']
export type Meta = string | Record<string, any>

export type MdxFile = {
  kind: 'MdxPage'
  name: string
  route: string
  locale?: string
  frontMatter?: FrontMatter
}

export type MetaJsonPath = `${string}/${MetaFilename}`
export type MdxPath = `${string}.${MarkdownExtension}`

export type FileMap = {
  [jsonPath: MetaJsonPath]: MetaJsonFile
  [mdxPath: MdxPath]: MdxFile
}

export type PageMapItem = Folder | MdxFile | MetaJsonFile

// PageMapItem without MetaJsonFile and with its meta from _meta.json
export type Page = (MdxFile | Folder<Page>) & {
  meta?: Exclude<Meta, string>
}

export type Heading = Omit<MDASTHeading, 'type' | 'children' | 'position'> & {
  value: string
  id: string
}

export type PageOpts = {
  filePath: string
  route: string
  frontMatter: FrontMatter
  pageMap: PageMapItem[]
  title: string
  headings: Heading[]
  hasJsxInH1?: boolean
  timestamp?: number
  flexsearch?: Flexsearch
  newNextLinkBehavior?: boolean
  readingTime?: ReadingTime
}

export type ReadingTime = {
  text: string
  minutes: number
  time: number
  words: number
}

type Theme = string
type Flexsearch =
  | boolean
  | {
      /**
       * Whether to index code blocks
       * @default true
       */
      codeblocks: boolean
      /**
       * A filter function to filter out files from indexing, and return the
       * index file key, or null to skip indexing.
       * A site can have multiple indexes, by default they're separated by
       * locales as multiple index files.
       */
      indexKey?: (
        filepath: string,
        route: string,
        locale?: string
      ) => null | string
    }
type Transform = (
  result: string,
  options: {
    route: string
  }
) => string | Promise<string>

export type NextraConfig = {
  theme: Theme
  themeConfig?: string
  defaultShowCopyCode?: boolean
  flexsearch?: Flexsearch
  staticImage?: boolean
  readingTime?: boolean
  latex?: boolean
  codeHighlight?: boolean
  /**
   * A function to modify the code of compiled MDX pages.
   * @experimental
   */
  transform?: Transform
  /**
   * A function to modify the `pageOpts` prop passed to theme layouts.
   * @experimental
   */
  transformPageOpts?: (pageOpts: PageOpts) => PageOpts
  mdxOptions?: Pick<ProcessorOptions, 'rehypePlugins' | 'remarkPlugins'> & {
    format?: 'detect' | 'mdx' | 'md'
    rehypePrettyCodeOptions?: Partial<RehypePrettyCodeOptions>
  }
}

export type Nextra = (
  ...args: [NextraConfig] | [theme: Theme, themeConfig: string]
) => (nextConfig: NextConfig) => NextConfig

const nextra: Nextra = () => () => ({})

export default nextra

export type ThemeConfig = any | null

export type NextraThemeLayoutProps = {
  pageOpts: PageOpts
  pageProps: any
  themeConfig: ThemeConfig
  children: ReactNode
}

export type NextraInternalGlobal = typeof globalThis & {
  [NEXTRA_INTERNAL]: {
    pageMap: PageMapItem[]
    route: string
    context: Record<
      string,
      {
        Content: FC
        pageOpts: PageOpts
        themeConfig: ThemeConfig
      }
    >
    refreshListeners: Record<string, (() => void)[]>
    Layout: FC<any>
  }
}

export type DynamicMetaDescriptor = {
  metaFilePath: string
  metaObjectKeyPath: string
  metaParentKeyPath: string
}
