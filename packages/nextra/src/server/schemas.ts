import type { ProcessorOptions } from '@mdx-js/mdx'
import type { MathJax3Config } from 'better-react-mathjax'
import type { Options as RehypeKatexOptions } from 'rehype-katex'
import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import { z } from 'zod'
import type { PageMapItem } from '../types'

export const mathJaxOptionsSchema = z
  .strictObject({
    /**
     * URL for MathJax. Defaults to `https://cdnjs.cloudflare.com`
     */
    src: z.string(),
    /**
     * MathJax config. See https://docs.mathjax.org/en/latest/options/index.html
     */
    config: z.custom<MathJax3Config>()
  })
  // eslint-disable-next-line deprecation/deprecation -- fixme
  .deepPartial()

export const nextraConfigSchema = z.strictObject({
  defaultShowCopyCode: z.boolean().optional(),
  search: z
    .union([
      z.boolean(),
      z.strictObject({
        /**
         * Whether to index code blocks
         */
        codeblocks: z.boolean()
      })
    ])
    .default({ codeblocks: false }),
  staticImage: z.boolean().default(true),
  readingTime: z.boolean().optional(),
  latex: z
    .union([
      z.boolean(),
      z.strictObject({
        renderer: z.literal('mathjax'),
        options: mathJaxOptionsSchema.optional()
      }),
      z.strictObject({
        renderer: z.literal('katex'),
        options: z.custom<RehypeKatexOptions>()
      })
    ])
    .optional(),
  codeHighlight: z.boolean().default(true),
  /**
   * A function to modify the `pageMap` passed to theme layouts.
   * @experimental
   */
  transformPageMap: z
    .custom<(pageMap: PageMapItem[], locale: string) => PageMapItem[]>()
    .optional(),
  mdxOptions: z
    .strictObject({
      rehypePlugins: z.custom<ProcessorOptions['rehypePlugins']>(),
      remarkPlugins: z.custom<ProcessorOptions['remarkPlugins']>(),
      recmaPlugins: z.custom<ProcessorOptions['recmaPlugins']>(),
      format: z.enum(['detect', 'mdx', 'md']).optional(),
      rehypePrettyCodeOptions: z.custom<RehypePrettyCodeOptions>().optional()
    })
    .optional(),
  useContentDir: z.boolean().optional()
})

export const pageThemeSchema = z.strictObject({
  breadcrumb: z.boolean(),
  collapsed: z.boolean(),
  footer: z.boolean(),
  layout: z.enum(['default', 'full']),
  navbar: z.boolean(),
  pagination: z.boolean(),
  sidebar: z.boolean(),
  timestamp: z.boolean(),
  toc: z.boolean(),
  typesetting: z.enum(['default', 'article'])
})

/**
 * An option to control how an item should be displayed in the sidebar:
 * - `normal`: the default behavior, item will be displayed
 * - `hidden`: the item will not be displayed in the sidebar entirely
 * - `children`: if the item is a folder, itself will be hidden but all its children will still be processed
 */
export const displaySchema = z.enum(['normal', 'hidden', 'children'])
const titleSchema = z.string()

const linkItemSchema = z.strictObject({
  href: z.string(),
  newWindow: z.boolean(),
  title: titleSchema
})

export const menuItemSchema = z.strictObject({
  display: displaySchema.optional(),
  items: z.record(linkItemSchema.partial({ href: true, newWindow: true })),
  title: titleSchema,
  type: z.literal('menu')
})

const separatorItemSchema = z.strictObject({
  title: titleSchema.optional(),
  type: z.literal('separator')
})

const itemSchema = linkItemSchema
  .extend({
    display: displaySchema,
    theme: pageThemeSchema,
    title: titleSchema,
    type: z.enum(['page', 'doc'])
  })
  // eslint-disable-next-line deprecation/deprecation -- fixme
  .deepPartial()

export const metaSchema = z
  .string()
  .or(menuItemSchema)
  .or(separatorItemSchema)
  .or(itemSchema)
