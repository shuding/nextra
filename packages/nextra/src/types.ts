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

export type MDXWrapper = FC<
  {
    children: ReactNode
    bottomContent?: ReactNode
  } & Omit<EvaluateResult, 'default'>
>

export type MetaRecord = Record<string, z.infer<typeof metaSchema>>

export type SeparatorItem = z.infer<typeof separatorItemSchema>
export type MenuItem = z.infer<typeof menuSchema>

/** Global index options that can be passed to pagefind.options() */
export type PagefindIndexOptions = {
  /** Overrides the URL path that Pagefind uses to load its search bundle */
  basePath?: string
  /** Appends the given baseURL to all search results. May be a path, or a full domain */
  baseUrl?: string
  /** The maximum length of excerpts that Pagefind should generate for search results. Default to 30 */
  excerptLength?: number
  /**
   * Multiply all rankings for this index by the given weight.
   *
   * Only applies in multisite setups, where one site should rank higher or lower than others.
   */
  indexWeight?: number
  /**
   * Merge this filter object into all search queries in this index.
   *
   * Only applies in multisite setups.
   */
  mergeFilter?: object
  /**
   * If set, will ass the search term as a query parameter under this key, for use with Pagefind's highlighting script.
   */
  highlightParam?: string
  language?: string
  /**
   * Whether an instance of Pagefind is the primary index or not (for multisite).
   *
   * This is set for you automatically, so it is unlikely you should set this directly.
   */
  primary?: boolean
  /**
   * Provides the ability to fine tune Pagefind's ranking algorithm to better suit your dataset.
   */
  ranking?: PagefindRankingWeights
}

type PagefindRankingWeights = {
  /**
    Controls page ranking based on similarity of terms to the search query (in length).
    Increasing this number means pages rank higher when they contain words very close to the query,
    e.g. if searching for `part` then `party` will boost a page higher than one containing `partition`.
    Minimum value is 0.0, where `party` and `partition` would be viewed equally.
  */
  termSimilarity?: number
  /**
    Controls how much effect the average page length has on ranking.
    Maximum value is 1.0, where ranking will strongly favour pages that are shorter than the average page on the site.
    Minimum value is 0.0, where ranking will exclusively look at term frequency, regardless of how long a document is.
  */
  pageLength?: number
  /**
    Controls how quickly a term saturates on the page and reduces impact on the ranking.
    Maximum value is 2.0, where pages will take a long time to saturate, and pages with very high term frequencies will take over.
    As this number trends to 0, it does not take many terms to saturate and allow other paramaters to influence the ranking.
    Minimum value is 0.0, where terms will saturate immediately and results will not distinguish between one term and many.
  */
  termSaturation?: number
  /**
    Controls how much ranking uses term frequency versus raw term count.
    Maximum value is 1.0, where term frequency fully applies and is the main ranking factor.
    Minimum value is 0.0, where term frequency does not apply, and pages are ranked based on the raw sum of words and weights.
    Values between 0.0 and 1.0 will interpolate between the two ranking methods.
    Reducing this number is a good way to boost longer documents in your search results, as they no longer get penalized for having a low term frequency.
  */
  termFrequency?: number
}

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
  /** Raw MDX source code */
  sourceCode: string
}
