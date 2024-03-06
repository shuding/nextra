import type { ProcessorOptions } from '@mdx-js/mdx'
import type { MathJax3Config } from 'better-react-mathjax'
import type { FC, ReactNode } from 'react'
import { isValidElement } from 'react'
import type { Options as RehypeKatexOptions } from 'rehype-katex'
import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import { z } from 'zod'
import type { PageMapItem } from '../types'

function isFunction(value: unknown): boolean {
  return typeof value === 'function'
}

export const fc = [isFunction, { message: 'Must be React.FC' }] as const

function isReactNode(value: unknown): boolean {
  return (
    value == null ||
    typeof value === 'string' ||
    isFunction(value) ||
    isValidElement(value as any)
  )
}

export const reactNode = [
  isReactNode,
  { message: 'Must be React.ReactNode or React.FC' }
] as const

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
  .deepPartial()
  .optional()

export const nextraConfigSchema = z
  .strictObject({
    themeConfig: z.string(),
    defaultShowCopyCode: z.boolean(),
    search: searchSchema,
    staticImage: z.boolean(),
    readingTime: z.boolean(),
    latex: z.union([
      z.boolean(),
      z.strictObject({
        renderer: z.literal('mathjax'),
        options: mathJaxOptionsSchema
      }),
      z.strictObject({
        renderer: z.literal('katex'),
        options: z.custom<RehypeKatexOptions>()
      })
    ]),
    codeHighlight: z.boolean(),
    /**
     * A function to modify the code of compiled MDX pages.
     * @experimental
     */
    transform: z.custom<Transform>(),
    /**
     * A function to modify the `pageMap` passed to theme layouts.
     * @experimental
     */
    transformPageMap:
      z.custom<(pageMap: PageMapItem[], locale: string) => PageMapItem[]>(),
    mdxOptions: z.strictObject({
      rehypePlugins: z.custom<ProcessorOptions['rehypePlugins']>(),
      remarkPlugins: z.custom<ProcessorOptions['remarkPlugins']>(),
      format: z.enum(['detect', 'mdx', 'md']),
      rehypePrettyCodeOptions: z.custom<RehypePrettyCodeOptions>()
    })
  })
  .deepPartial()
  .extend({ theme: z.string() })

export const pageThemeSchema = z.strictObject({
  breadcrumb: z.boolean(),
  collapsed: z.boolean(),
  footer: z.boolean(),
  layout: z.enum(['default', 'full', 'raw']),
  navbar: z.boolean(),
  pagination: z.boolean(),
  sidebar: z.boolean(),
  timestamp: z.boolean(),
  toc: z.boolean(),
  typesetting: z.enum(['default', 'article']),
  topContent: z.custom<ReactNode | FC>(...reactNode),
  bottomContent: z.custom<ReactNode | FC>(...reactNode)
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
  .deepPartial()

export const metaSchema = z
  .string()
  .or(menuItemSchema)
  .or(separatorItemSchema)
  .or(itemSchema)
