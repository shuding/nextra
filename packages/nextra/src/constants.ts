import path from 'node:path'
import type { ProcessorOptions } from '@mdx-js/mdx'
import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import { z } from 'zod'
import type { NextraConfig, PageOpts } from './types'

export const MARKDOWN_EXTENSION_REGEX = /\.mdx?$/

export const MARKDOWN_URL_EXTENSION_REGEX = /\.mdx?(?:(?=[#?])|$)/

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const DEFAULT_LOCALE = 'en-US'

export const DEFAULT_CONFIG = {
  staticImage: true,
  search: {
    codeblocks: true
  },
  codeHighlight: true
} satisfies Partial<NextraConfig>

export const OFFICIAL_THEMES = ['nextra-theme-docs', 'nextra-theme-blog']

export const META_FILENAME = '_meta.json'
export const DYNAMIC_META_FILENAME = '_meta.js'

export const CWD = process.cwd()

export const MARKDOWN_EXTENSIONS = ['md', 'mdx'] as const

export const PUBLIC_DIR = path.join(CWD, 'public')

export const EXTERNAL_URL_REGEX = /^https?:\/\//

export const NEXTRA_INTERNAL = Symbol.for('__nextra_internal__')

export const CODE_BLOCK_FILENAME_REGEX = /filename="([^"]+)"/

export const DEFAULT_LOCALES = ['']

export const ERROR_ROUTES = new Set(['/404', '/500'])

export const CHUNKS_DIR = path.join(CWD, '.next', 'static', 'chunks')

export const searchSchema = z.boolean().or(
  z.strictObject({
    /**
     * Whether to index code blocks
     * @default true
     */
    codeblocks: z.boolean(),
    /**
     * A filter function to filter out files from indexing, and return the
     * index file key, or null to skip indexing.
     * A site can have multiple indexes, by default they're separated by
     * locales as multiple index files.
     */
    indexKey: z
      .custom<
        (filepath: string, route: string, locale?: string) => null | string
      >()
      .optional()
  })
)

type Transform = (
  result: string,
  options: {
    route: string
  }
) => string | Promise<string>

export const nextraConfigSchema = z
  .strictObject({
    themeConfig: z.string(),
    defaultShowCopyCode: z.boolean(),
    search: searchSchema,
    staticImage: z.boolean(),
    readingTime: z.boolean(),
    latex: z.boolean(),
    codeHighlight: z.boolean(),
    /**
     * A function to modify the code of compiled MDX pages.
     * @experimental
     */
    transform: z.custom<Transform>(),
    /**
     * A function to modify the `pageOpts` prop passed to theme layouts.
     * @experimental
     */
    transformPageOpts: z.custom<(pageOpts: PageOpts) => PageOpts>(),
    mdxOptions: z.strictObject({
      rehypePlugins: z.custom<ProcessorOptions['rehypePlugins']>(),
      remarkPlugins: z.custom<ProcessorOptions['remarkPlugins']>(),
      format: z.enum(['detect', 'mdx', 'md']),
      rehypePrettyCodeOptions: z.custom<RehypePrettyCodeOptions>()
    })
  })
  .deepPartial()
  .extend({ theme: z.string() })
