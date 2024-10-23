import type { Heading as MDASTHeading } from 'mdast'
import type { Metadata, NextConfig } from 'next'
import type { FC, ReactElement, ReactNode } from 'react'
import type { z } from 'zod'
import type { mathJaxOptionsSchema, nextraConfigSchema } from './server/schemas'

export interface LoaderOptions extends NextraConfig {
  isPageImport?: boolean
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
  value: string | ReactElement
  id: string
}

export type PageOpts = {
  title: string
  metadata: Metadata & {
    filePath: string
    timestamp?: number
    readingTime?: ReadingTime
  }
}

export type ReadingTime = {
  text: string
  minutes: number
  time: number
  words: number
}

export type NextraConfig = z.infer<typeof nextraConfigSchema>

export type MathJaxOptions = z.infer<typeof mathJaxOptionsSchema>

export type Nextra = (
  nextraConfig: NextraConfig
) => (nextConfig: NextConfig) => NextConfig

export type MDXWrapper = FC<
  {
    toc: Heading[]
    children: ReactNode
  } & PageOpts
>

export type UseTOC = (props?: Record<string, any>) => Heading[]
