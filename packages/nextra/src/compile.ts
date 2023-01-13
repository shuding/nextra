import { createProcessor, ProcessorOptions } from '@mdx-js/mdx'
import { Processor } from '@mdx-js/mdx/lib/core'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import readingTime from 'remark-reading-time'
import grayMatter from 'gray-matter'

import {
  remarkStaticImage,
  remarkHeadings,
  structurize,
  parseMeta,
  attachMeta
} from './mdx-plugins'
import { LoaderOptions, PageOpts, ReadingTime } from './types'
import theme from './theme.json'
import { truthy } from './utils'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { CODE_BLOCK_FILENAME_REGEX } from './constants'

globalThis.__nextra_temp_do_not_use = () => {
  // @ts-expect-error -- ignore error - File is not a module
  import('./__temp__')
}

const DEFAULT_REHYPE_PRETTY_CODE_OPTIONS = {
  theme,
  onVisitLine(node: any) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }]
    }
  },
  onVisitHighlightedLine(node: any) {
    node.properties.className.push('highlighted')
  },
  onVisitHighlightedWord(node: any) {
    node.properties.className = ['highlighted']
  },
  filterMetaString: (meta: string) => meta.replace(CODE_BLOCK_FILENAME_REGEX, '')
}

const cachedCompilerForFormat: Record<
  Exclude<ProcessorOptions['format'], undefined>,
  Processor
> = Object.create(null)

type MdxOptions = LoaderOptions['mdxOptions'] &
  Pick<ProcessorOptions, 'jsx' | 'outputFormat'>

export async function compileMdx(
  source: string,
  loaderOptions: Pick<
    LoaderOptions,
    | 'staticImage'
    | 'flexsearch'
    | 'defaultShowCopyCode'
    | 'readingTime'
    | 'latex'
    | 'codeHighlight'
  > & { mdxOptions?: MdxOptions } = {},
  filePath = '',
  useCachedCompiler = false
) {
  // Extract frontMatter information if it exists
  const { data: frontMatter, content } = grayMatter(source)

  const structurizedData = Object.create(null)

  const {
    jsx = false,
    format = 'mdx',
    outputFormat = 'function-body',
    remarkPlugins = [],
    rehypePlugins = [],
    rehypePrettyCodeOptions
  }: MdxOptions = {
    ...loaderOptions.mdxOptions,
    // You can override MDX options in the frontMatter too.
    ...(frontMatter.mdxOptions as Record<string, unknown>)
  }

  const compiler =
    (useCachedCompiler && cachedCompilerForFormat[format]) ||
    (cachedCompilerForFormat[format] = createProcessor({
      jsx,
      format,
      outputFormat,
      providerImportSource: 'nextra/mdx',
      // https://github.com/hashicorp/next-mdx-remote/issues/307#issuecomment-1363415249
      development: false,
      remarkPlugins: [
        ...remarkPlugins,
        remarkGfm,
        remarkHeadings,
        loaderOptions.staticImage && remarkStaticImage,
        loaderOptions.flexsearch &&
          structurize(structurizedData, loaderOptions.flexsearch),
        loaderOptions.readingTime && readingTime,
        loaderOptions.latex && remarkMath
      ].filter(truthy),
      rehypePlugins: [
        ...rehypePlugins,
        parseMeta,
        loaderOptions.codeHighlight &&
          ([
            rehypePrettyCode,
            {
              ...DEFAULT_REHYPE_PRETTY_CODE_OPTIONS,
              ...rehypePrettyCodeOptions
            }
          ] as any),
        [
          attachMeta,
          { defaultShowCopyCode: loaderOptions.defaultShowCopyCode }
        ],
        loaderOptions.latex && rehypeKatex
      ].filter(truthy)
    }))

  try {
    compiler.data('headingMeta', { headings: [] })
    const vFile = await compiler.process(
      filePath ? { value: content, path: filePath } : content
    )

    const headingMeta = compiler.data('headingMeta') as Pick<
      PageOpts,
      'headings' | 'hasJsxInH1' | 'title'
    >
    const readingTime = vFile.data.readingTime as ReadingTime | undefined

    return {
      result: String(vFile).replace('export default MDXContent;', ''),
      ...headingMeta,
      ...(readingTime && { readingTime }),
      structurizedData,
      frontMatter
    }
  } catch (err) {
    console.error(`[nextra] Error compiling ${filePath}.`)
    throw err
  }
}
