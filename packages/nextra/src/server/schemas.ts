import type { ProcessorOptions } from '@mdx-js/mdx'
import type { MathJax3Config } from 'better-react-mathjax'
import type { ReactElement, ReactNode } from 'react'
import { isValidElement } from 'react'
import type { Options as RehypeKatexOptions } from 'rehype-katex'
import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import { z } from 'zod'
import { pageTitleFromFilename } from './utils.js'

export const mathJaxOptionsSchema = z.strictObject({
  /**
   * URL for MathJax. Defaults to `https://cdnjs.cloudflare.com`
   */
  src: z.string().optional(),
  /**
   * MathJax config. See https://docs.mathjax.org/en/latest/options/index.html
   */
  config: z.custom<MathJax3Config>().optional()
})

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
  mdxOptions: z
    .strictObject({
      rehypePlugins: z.custom<ProcessorOptions['rehypePlugins']>(),
      remarkPlugins: z.custom<ProcessorOptions['remarkPlugins']>(),
      recmaPlugins: z.custom<ProcessorOptions['recmaPlugins']>(),
      format: z.enum(['detect', 'mdx', 'md']).default('detect'),
      rehypePrettyCodeOptions: z.custom<RehypePrettyCodeOptions>().default({})
    })
    .default({}),
  whiteListTagsStyling: z.array(z.string()).optional(),
  contentDirBasePath: z
    .string()
    .startsWith('/')
    .refine(
      value => value.length === 1 || !value.endsWith('/'),
      value => ({ message: `"${value}" must not end with "/"` })
    )
    .default('/'),
  unstable_shouldAddLocaleToLinks: z.boolean().default(false)
})

export const element = z.custom<ReactElement<Record<string, unknown>>>(
  isValidElement,
  { message: 'Must be a valid React element' }
)
/**
 * https://react.dev/reference/react/isValidElement#react-elements-vs-react-nodes
 */
export const reactNode = z.custom<ReactNode>(
  function checkReactNode(data): data is ReactNode {
    if (
      // Check if it's a valid React element
      isValidElement(data) ||
      // Check if it's null or undefined
      data == null ||
      typeof data === 'string' ||
      typeof data === 'number' ||
      typeof data === 'boolean'
    ) {
      return true
    }
    // Check if it's an array of React nodes
    if (Array.isArray(data)) {
      return data.every(item => checkReactNode(item))
    }
    // If it's none of the above, it's not a valid React node
    return false
  },
  { message: 'Must be a valid React node' }
)

const stringOrElement = z.union([z.string(), element])

const pageThemeSchema = z.strictObject({
  breadcrumb: z.boolean().optional(),
  collapsed: z.boolean().optional(),
  footer: z.boolean().optional(),
  layout: z.enum(['default', 'full']).optional(),
  navbar: z.boolean().optional(),
  pagination: z.boolean().optional(),
  sidebar: z.boolean().optional(),
  timestamp: z.boolean().optional(),
  toc: z.boolean().optional(),
  typesetting: z.enum(['default', 'article']).optional()
})

const title = stringOrElement.optional()

const linkSchema = z.strictObject({
  title,
  href: z.string()
})

export const separatorItemSchema = z.strictObject({
  type: z.literal('separator'),
  title
})

const menuItemSchema = z
  .union([
    stringOrElement,
    linkSchema,
    z.strictObject({ title: stringOrElement }),
    separatorItemSchema
  ])
  .transform(transformTitle)

export const menuSchema = z.strictObject({
  type: z.literal('menu'),
  title,
  items: z.record(menuItemSchema).transform(obj => {
    for (const key in obj) {
      // @ts-expect-error -- fixme
      obj[key].title ||= pageTitleFromFilename(key)
    }
    return obj
  }),
  display: z.enum(['normal', 'hidden']).optional()
})

export const itemSchema = z.strictObject({
  type: z.enum(['page', 'doc']).optional(),
  title,
  /**
   * An option to control how an item should be displayed in the sidebar:
   * - `normal`: the default behavior, item will be displayed
   * - `hidden`: the item will not be displayed in the sidebar entirely
   * - `children`: if the item is a folder, itself will be hidden but all its children will still be processed
   */
  display: z.enum(['normal', 'hidden', 'children']).optional(),
  theme: pageThemeSchema.optional()
})

export const metaSchema = z.union([
  stringOrElement.transform(transformTitle),
  itemSchema,
  linkSchema.extend({
    type: z.enum(['page', 'doc']).optional(),
    display: z.enum(['normal', 'hidden']).optional()
  }),
  separatorItemSchema,
  menuSchema
])

function transformTitle<T>(title: T) {
  return typeof title === 'string' || isValidElement(title) ? { title } : title
}
