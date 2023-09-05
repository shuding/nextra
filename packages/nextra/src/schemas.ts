import type { ProcessorOptions } from '@mdx-js/mdx'
import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import { z } from 'zod'
import type { PageOpts } from './types'

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
