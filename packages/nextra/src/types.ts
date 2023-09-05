import type { GrayMatterFile } from 'gray-matter'
import type { Heading as MDASTHeading } from 'mdast'
import type { NextConfig } from 'next'
import type { FC, ReactNode } from 'react'
import type { z } from 'zod'
import type {
  MARKDOWN_EXTENSIONS,
  META_FILENAME,
  NEXTRA_INTERNAL,
  nextraConfigSchema,
  searchSchema
} from './constants'

type MetaFilename = typeof META_FILENAME
type MarkdownExtension = (typeof MARKDOWN_EXTENSIONS)[number]

export interface LoaderOptions extends NextraConfig {
  isPageImport?: boolean
  locales: string[]
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

export type DynamicFolder = {
  type: 'folder'
  items: DynamicMeta
  title?: string
}

export type DynamicMetaItem = Meta | DynamicFolder

export type DynamicMeta = Record<string, DynamicMetaItem>

export type DynamicMetaJsonFile = {
  kind: 'Meta'
  locale?: string
  data: DynamicMeta
}

export type FrontMatter = GrayMatterFile<string>['data']
export type Meta = string | Record<string, any>

export type MdxFile<FrontMatterType = FrontMatter> = {
  kind: 'MdxPage'
  name: string
  route: string
  locale?: string
  frontMatter?: FrontMatterType
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

export type Heading = {
  depth: MDASTHeading['depth']
  value: string
  id: string
}

export type PageOpts<FrontMatterType = FrontMatter> = {
  filePath: string
  frontMatter: FrontMatterType
  pageMap: PageMapItem[]
  title: string
  headings: Heading[]
  hasJsxInH1?: boolean
  timestamp?: number
  readingTime?: ReadingTime
}

export type ReadingTime = {
  text: string
  minutes: number
  time: number
  words: number
}

export type Search = z.infer<typeof searchSchema>

export type NextraConfig = z.infer<typeof nextraConfigSchema>

export type Nextra = (
  nextraConfig: NextraConfig
) => (nextConfig: NextConfig) => NextConfig

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
    context: Record<string, { Content: FC; pageOpts: PageOpts }>
    refreshListeners: Record<string, (() => void)[]>
    Layout: FC<any>
    themeConfig?: ThemeConfig
  }
}

export type DynamicMetaDescriptor = {
  metaFilePath: string
  metaObjectKeyPath: string
  metaParentKeyPath: string
}

export type StructurizedData = Record<string, string>

export type SearchData = {
  [route: string]: {
    title: string
    data: StructurizedData
  }
}
