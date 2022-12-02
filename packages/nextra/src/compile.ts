import { createProcessor, ProcessorOptions } from '@mdx-js/mdx'
import { Processor } from '@mdx-js/mdx/lib/core'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import { rehypeMdxTitle } from 'rehype-mdx-title'
import readingTime from 'remark-reading-time'
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
  }
}

export async function compileMdx(
  source: string,
  loaderOptions: Pick<
    LoaderOptions,
    'staticImage' | 'flexsearch' | 'defaultShowCopyCode' | 'readingTime'
  > & {
    mdxOptions?: LoaderOptions['mdxOptions'] &
      Pick<ProcessorOptions, 'jsx' | 'outputFormat'>
  } = {},
  filePath = ''
) {
  const structurizedData = Object.create(null)

  const mdxOptions = loaderOptions.mdxOptions || {}

  const compiler = createCompiler({
    jsx: mdxOptions.jsx || false,
    outputFormat: mdxOptions.outputFormat || 'function-body',
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [
      ...(mdxOptions.remarkPlugins || []),
      remarkGfm,
      remarkHeadings,
      loaderOptions.staticImage && ([remarkStaticImage, { filePath }] as any),
      loaderOptions.flexsearch &&
        structurize(structurizedData, loaderOptions.flexsearch),
      loaderOptions.readingTime && readingTime
    ].filter(truthy),
    rehypePlugins: [
      ...(mdxOptions.rehypePlugins || []),
      parseMeta,
      [
        rehypePrettyCode,
        { ...rehypePrettyCodeOptions, ...mdxOptions.rehypePrettyCodeOptions }
      ],
      [rehypeMdxTitle, { name: '__nextra_title__' }],
      [attachMeta, { defaultShowCopyCode: loaderOptions.defaultShowCopyCode }]
    ]
  })
  try {
    const vFile = await compiler.process(source)
    const result = String(vFile)
      .replace('export const __nextra_title__', 'const __nextra_title__')
      .replace('export default MDXContent;', '')
    const readingTime = vFile.data.readingTime as ReadingTime | undefined
    return {
      result,
      ...(compiler.data('headingMeta') as Pick<
        PageOpts,
        'headings' | 'hasJsxInH1'
      >),
      ...(readingTime && { readingTime }),
      structurizedData
    }
  } catch (err) {
    console.error(`[nextra] Error compiling ${filePath}.`)
    throw err
  }
}
