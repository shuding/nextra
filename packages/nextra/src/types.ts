import type { Heading as MDASTHeading } from 'mdast'
import type { Metadata } from 'next'
import type { FC, ReactElement, ReactNode } from 'react'
import type { z } from 'zod'
import type {
  MathJaxOptionsSchema,
  menuSchema,
  metaSchema,
  NextraConfigSchema,
  separatorItemSchema
} from './server/schemas.js'

export type { NextraConfig } from './types.generated.js'

type NextraConfigFromZod = z.infer<typeof NextraConfigSchema>

export interface LoaderOptions extends NextraConfigFromZod {
  isPageImport?: boolean
  locales: string[]
  contentDir?: string
  shouldAddLocaleToLinks?: boolean
}

type TPageItem = { name: string; route: string; __pagePath: string }
type TMetaItem = { __metaPath: string }

interface TFolder<T = TItem> {
  name: string
  route: string
  children: T[]
}

export type TItem = TPageItem | TMetaItem | TFolder

export interface Folder<FileType = PageMapItem> {
  name: string
  route: string
  children: FileType[]
}

export type Import = {
  importName: string
  filePath: string
}

export type MetaJsonFile = {
  data: {
    [fileName: string]: Meta
  }
}

export type DynamicFolder = {
  items: DynamicMeta
  title?: string
}

export type DynamicMetaItem = Meta | DynamicFolder

export type DynamicMeta = Record<string, DynamicMetaItem>

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

export type $NextraMetadata = Omit<Metadata, 'title'> & {
  title: string
  filePath: string
  timestamp?: number
  readingTime?: ReadingTime
}

export type ReadingTime = {
  text: string
  minutes: number
  time: number
  words: number
}

export type MathJaxOptions = z.infer<typeof MathJaxOptionsSchema>

export type MDXWrapper = FC<{
  toc: Heading[]
  children: ReactNode
  metadata: $NextraMetadata
  bottomContent?: ReactNode
}>

export type MetaRecord = Record<string, z.infer<typeof metaSchema>>

export type SeparatorItem = z.infer<typeof separatorItemSchema>
export type MenuItem = z.infer<typeof menuSchema>

/**
 * Options that can be passed to `pagefind.search()`.
 * @remarks Copied from https://github.com/CloudCannon/pagefind/blob/2a0aa90cfb78bb8551645ac9127a1cd49cf54add/pagefind_web_js/types/index.d.ts#L72-L82
 */
export type PagefindSearchOptions = {
  /**
   * If set, this call will load all assets but return before searching. Prefer using `pagefind.preload()` instead.
   */
  preload?: boolean
  /**
   * Add more verbose console logging for this search query.
   */
  verbose?: boolean
  /**
   * The set of filters to execute with this search. Input type is extremely flexible, see the filtering docs for details.
   */
  filters?: object
  /**
   * The set of sorts to use for this search, instead of relevancy.
   */
  sort?: object
}

export type NextraMetadata = Metadata & {
  asIndexPage?: boolean
  sidebarTitle?: string
}

export type EvaluateResult = {
  /** The MDX component to render. */
  default: FC<any>
  /** Table of contents list. */
  toc: Heading[]
  /** Page's front matter or `metadata` object including `title`, `description`, etc. */
  metadata: $NextraMetadata
}
