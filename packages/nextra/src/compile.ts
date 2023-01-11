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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.__nextra_temp_do_not_use = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import('./__temp__')
}

const createCompiler = (mdxOptions: ProcessorOptions): Processor => {
  const compiler = createProcessor(mdxOptions)
  compiler.data('headingMeta', {
    headings: []
  })
  return compiler
}

const rehypePrettyCodeOptions = {
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
  filterMetaString: (meta: string) => meta.replace(/filename="[^"]*"/, '')
}

let cachedCompiler: Processor

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
  > & {
    mdxOptions?: LoaderOptions['mdxOptions'] &
      Pick<ProcessorOptions, 'jsx' | 'outputFormat' | 'format'>
  } = {},
  filePath = '',
  useCachedCompiler = false
) {
  // Extract frontMatter information if it exists
  const { data: frontMatter, content } = grayMatter(source)

  source = content

  const structurizedData = Object.create(null)

  const mdxOptions = {
    ...(loaderOptions.mdxOptions || {}),
    // You can override MDX options in the frontMatter too.
    ...frontMatter.mdxOptions
  }

  const compiler =
    (useCachedCompiler && cachedCompiler) ||
    (cachedCompiler = createCompiler({
      jsx: mdxOptions.jsx || false,
      outputFormat: mdxOptions.outputFormat || 'function-body',
      providerImportSource: 'nextra/mdx',
      format: mdxOptions.format || 'mdx',
      // https://github.com/hashicorp/next-mdx-remote/issues/307#issuecomment-1363415249
      development: false,
      remarkPlugins: [
        ...(mdxOptions.remarkPlugins || []),
        remarkGfm,
        remarkHeadings,
        loaderOptions.staticImage && ([remarkStaticImage, { filePath }] as any),
        loaderOptions.flexsearch &&
          structurize(structurizedData, loaderOptions.flexsearch),
        loaderOptions.readingTime && readingTime,
        loaderOptions.latex && remarkMath
      ].filter(truthy),
      rehypePlugins: [
        ...(mdxOptions.rehypePlugins || []),
        parseMeta,
        loaderOptions.codeHighlight &&
          ([
            rehypePrettyCode,
            {
              ...rehypePrettyCodeOptions,
              ...mdxOptions.rehypePrettyCodeOptions
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
    const vFile = await compiler.process(
      filePath
        ? {
            value: source,
            path: filePath
          }
        : source
    )
    let result = String(vFile).replace('export default MDXContent;', '')

    const headingMeta = compiler.data('headingMeta') as Pick<
      PageOpts,
      'headings' | 'hasJsxInH1' | 'title'
    >
    if (headingMeta.title) {
      result += `\nconst __nextra_title__ = ${JSON.stringify(
        headingMeta.title
      )}`
    }

    const readingTime = vFile.data.readingTime as ReadingTime | undefined

    return {
      result,
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
