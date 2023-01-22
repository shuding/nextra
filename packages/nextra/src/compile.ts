import path from 'node:path'
import { createRequire } from 'node:module'
import { createProcessor, ProcessorOptions } from '@mdx-js/mdx'
import { Processor } from '@mdx-js/mdx/lib/core'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkReadingTime from 'remark-reading-time'
import grayMatter from 'gray-matter'

import {
  remarkStaticImage,
  remarkHeadings,
  remarkReplaceImports,
  structurize,
  parseMeta,
  attachMeta,
  remarkRemoveImports
} from './mdx-plugins'
import { LoaderOptions, PageOpts, ReadingTime } from './types'
import theme from './theme.json'
import { truthy } from './utils'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { CODE_BLOCK_FILENAME_REGEX, CWD, DEFAULT_LOCALE } from './constants'

globalThis.__nextra_temp_do_not_use = () => {
  import('./__temp__')
}

const require = createRequire(import.meta.url)

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
  filterMetaString: (meta: string) =>
    meta.replace(CODE_BLOCK_FILENAME_REGEX, '')
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
  > & { mdxOptions?: MdxOptions; route?: string; locale?: string } = {},
  { filePath = '', useCachedCompiler = false, isPageImport = true } = {}
) {
  // Extract frontMatter information if it exists
  const { data: frontMatter, content } = grayMatter(source)

  const structurizedData = Object.create(null)

  let searchIndexKey: string | null = null
  if (typeof loaderOptions.flexsearch === 'object') {
    if (loaderOptions.flexsearch.indexKey) {
      searchIndexKey = loaderOptions.flexsearch.indexKey(
        filePath,
        loaderOptions.route || '',
        loaderOptions.locale
      )
      if (searchIndexKey === '') {
        searchIndexKey = loaderOptions.locale || DEFAULT_LOCALE
      }
    } else {
      searchIndexKey = loaderOptions.locale || DEFAULT_LOCALE
    }
  } else if (loaderOptions.flexsearch) {
    searchIndexKey = loaderOptions.locale || DEFAULT_LOCALE
  }

  const {
    jsx = false,
    format: _format = 'mdx',
    outputFormat = 'function-body',
    remarkPlugins = [],
    rehypePlugins = [],
    rehypePrettyCodeOptions
  }: MdxOptions = {
    ...loaderOptions.mdxOptions,
    // You can override MDX options in the frontMatter too.
    ...frontMatter.mdxOptions
  }

  const format =
    _format === 'detect' ? (filePath.endsWith('.mdx') ? 'mdx' : 'md') : _format

  const {
    staticImage,
    flexsearch,
    readingTime,
    latex,
    codeHighlight,
    defaultShowCopyCode
  } = loaderOptions

  // https://github.com/shuding/nextra/issues/1303
  const isFileOutsideCWD =
    !isPageImport && path.relative(CWD, filePath).startsWith('..')

  const compiler =
    (useCachedCompiler && cachedCompilerForFormat[format]) ||
    (cachedCompilerForFormat[format] = createProcessor({
      jsx,
      format,
      outputFormat,
      providerImportSource: isFileOutsideCWD
        ? require.resolve('nextra').replace(/index\.js$/, 'mdx.mjs') // fixes Package subpath './mdx' is not defined by "exports"
        : 'nextra/mdx',
      remarkPlugins: [
        ...remarkPlugins,
        outputFormat === 'function-body' && remarkRemoveImports,
        remarkGfm,
        remarkHeadings,
        staticImage && remarkStaticImage,
        searchIndexKey !== null && structurize(structurizedData, flexsearch),
        readingTime && remarkReadingTime,
        latex && remarkMath,
        isFileOutsideCWD && remarkReplaceImports
      ].filter(truthy),
      rehypePlugins: [
        ...rehypePlugins,
        [parseMeta, { defaultShowCopyCode }],
        codeHighlight !== false &&
          ([
            rehypePrettyCode,
            {
              ...DEFAULT_REHYPE_PRETTY_CODE_OPTIONS,
              ...rehypePrettyCodeOptions
            }
          ] as any),
        attachMeta,
        latex && rehypeKatex
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
      result: String(vFile),
      ...headingMeta,
      ...(readingTime && { readingTime }),
      structurizedData,
      searchIndexKey,
      frontMatter
    }
  } catch (err) {
    console.error(`[nextra] Error compiling ${filePath}.`)
    throw err
  }
}
