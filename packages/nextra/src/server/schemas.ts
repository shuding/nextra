import type { ProcessorOptions } from '@mdx-js/mdx'
import type { MathJax3Config } from 'better-react-mathjax'
import type { ReactElement, ReactNode } from 'react'
import { isValidElement } from 'react'
import type { Options as RehypeKatexOptions } from 'rehype-katex'
import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import { z } from 'zod'
import { pageTitleFromFilename } from './utils.js'

export const mathJaxOptionsSchema = z.strictObject({
  src: z.string().optional().meta({
    description: 'URL for MathJax.'
    // default: 'https://cdnjs.cloudflare.com'
  }),
  config: z.custom<MathJax3Config>().optional().meta({
    description:
      'MathJax config. See https://docs.mathjax.org/en/latest/options/index.html.'
    // type: 'MathJax3Config'
  })
})

const mdxOptionsSchema = z.strictObject({
  rehypePlugins: z.custom<ProcessorOptions['rehypePlugins']>().optional().meta({
    description: 'List of rehype plugins.'
  }),
  remarkPlugins: z.custom<ProcessorOptions['remarkPlugins']>().optional().meta({
    description: 'List of remark plugins.'
  }),
  recmaPlugins: z.custom<ProcessorOptions['recmaPlugins']>().optional().meta({
    description:
      'List of recma plugins. This is a new ecosystem, currently in beta, to transform esast trees (JavaScript).'
  }),
  format: z.enum(['detect', 'mdx', 'md']).default('detect').meta({
    description:
      "Format of the file.\n\
`'md'` means treat as markdown and `'mdx'` means treat as MDX. `'detect'` means try to detect the format based on file path."
  }),
  rehypePrettyCodeOptions: z.custom<RehypePrettyCodeOptions>().default({})
})

export const nextraConfigSchema = z.strictObject({
  defaultShowCopyCode: z.boolean().optional(),
  search: z
    .union([
      z.boolean(),
      z.strictObject({
        codeblocks: z.boolean().meta({
          description: 'Whether to index code blocks.'
        })
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
        options: z.custom<RehypeKatexOptions>().meta({
          description: 'KaTeX options. See https://katex.org/docs/options.html.'
        })
      })
    ])
    .optional(),
  codeHighlight: z.boolean().default(true),
  mdxOptions: mdxOptionsSchema.default(mdxOptionsSchema.parse({})),
  whiteListTagsStyling: z.array(z.string()).optional(),
  contentDirBasePath: z
    .string()
    .startsWith('/')
    .refine(value => value.length === 1 || !value.endsWith('/'), {
      error: 'Must not end with "/"'
    })
    .default('/'),
  unstable_shouldAddLocaleToLinks: z.boolean().default(false)
})

export const element = z.custom<ReactElement<Record<string, unknown>>>(
  function checkReactElement(data) {
    return isValidElement(data)
  },
  { error: 'Must be a valid React element' }
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
  { error: 'Must be a valid React node' }
)

const stringOrElement = z.union([z.string(), element])

export const pageThemeSchema = z.strictObject({
  breadcrumb: z.boolean().optional().meta({
    description: 'Show or hide breadcrumb navigation.'
  }),
  collapsed: z.boolean().optional().meta({
    description:
      'Indicates whether the item in sidebar is collapsed by default.'
  }),
  footer: z.boolean().optional().meta({
    description: 'Specifies whether to display the footer.'
  }),
  layout: z.enum(['default', 'full']).optional().meta({
    description: 'Defines the layout style.'
  }),
  navbar: z.boolean().optional().meta({
    description: 'Specifies whether to display the navbar.'
  }),
  pagination: z.boolean().optional().meta({
    description: 'Determines if pagination controls are shown.'
  }),
  sidebar: z.boolean().optional().meta({
    description: 'Specifies whether to display the sidebar.'
  }),
  timestamp: z.boolean().optional().meta({
    description: 'Indicates if "last updated" timestamps are displayed.'
  }),
  toc: z.boolean().optional().meta({
    description: 'Determines whether a table of contents is displayed.'
  }),
  typesetting: z.enum(['default', 'article']).optional().meta({
    description: 'Configures the text typesetting style.'
  })
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
  items: z.record(z.string(), menuItemSchema).transform(obj => {
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
