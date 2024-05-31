import type { Heading as MDASTHeading } from 'mdast'
import type { NextConfig } from 'next'
import type { FC, ReactNode } from 'react'
import type { z } from 'zod'
import type { NEXTRA_INTERNAL } from './constants.js'
import type {
  mathJaxOptionsSchema,
  nextraConfigSchema,
  searchSchema
} from './server/schemas'

export interface LoaderOptions extends NextraConfig {
  isPageImport?: boolean
  isPageMapImport?: boolean
  isMetaFile?: boolean
  locales: string[]
}

export interface Folder<FileType = PageMapItem> {
  name: string
  route: string
  children: FileType[]
}

export type MetaJsonFile = {
  data: {
    [fileName: string]: Meta
  }
}

export type DynamicFolder = {
  type: 'folder'
  items: DynamicMeta
  title?: string
}

export type DynamicMetaItem = Meta | DynamicFolder

export type DynamicMeta = Record<string, DynamicMetaItem>

export type DynamicMetaJsonFile = {
  data: DynamicMeta
}

export type FrontMatter = Record<string, any>
export type Meta = string | Record<string, any>

export type MdxFile<FrontMatterType = FrontMatter> = {
  name: string
  route: string
  frontMatter?: FrontMatterType
}

export type PageMapItem = Folder | MdxFile | MetaJsonFile

// PageMapItem without MetaJsonFile and with its meta from _meta.json
export type Page = (MdxFile | Folder<Page>) & {
  meta?: Exclude<Meta, string>
}

export type Heading = {
  depth: Exclude<MDASTHeading['depth'], 1>
  value: string
  id: string
}

export type PageOpts<FrontMatterType = FrontMatter> = {
  filePath: string
  frontMatter: FrontMatterType
  pageMap: PageMapItem[]
  title: string
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

export type MathJaxOptions = z.infer<typeof mathJaxOptionsSchema>

export type Nextra = (
  nextraConfig: NextraConfig
) => (nextConfig: NextConfig) => NextConfig

export type ThemeConfig = any | null

export type NextraThemeLayoutProps<F = FrontMatter> = {
  pageOpts: PageOpts<F>
  pageProps: any
  themeConfig: ThemeConfig
  children: ReactNode
}

export type NextraMDXContent = FC<{
  toc: Heading[]
  children: ReactNode
}>

export type UseTOC = (props: Record<string, any>) => Heading[]

export type NextraInternalGlobal = typeof globalThis & {
  [NEXTRA_INTERNAL]: {
    pageMap: PageMapItem[]
    route: string
    context: Record<
      string,
      {
        Content: NextraMDXContent
        pageOpts: PageOpts
        useTOC: UseTOC
      }
    >
    Layout: FC<NextraThemeLayoutProps>
    themeConfig?: ThemeConfig
  }
}

export type DynamicMetaDescriptor = Record<string, () => any>

export type StructurizedData = Record<string, string>

export type SearchData = {
  [route: string]: {
    title: string
    data: StructurizedData
  }
}
