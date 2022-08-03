import { createProcessor, ProcessorOptions } from '@mdx-js/mdx'
import { Processor } from '@mdx-js/mdx/lib/core'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import { rehypeMdxTitle } from 'rehype-mdx-title'
import { remarkStaticImage } from './mdx-plugins/static-image'
import { remarkHeadings } from './mdx-plugins/remark'
import { LoaderOptions, PageOpts } from './types'
import structurize from './mdx-plugins/structurize'
import { parseMeta, attachMeta } from './mdx-plugins/rehype-handler'
import theme from './theme.json'

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
  mdxOptions: LoaderOptions['mdxOptions'] &
    Pick<ProcessorOptions, 'jsx' | 'outputFormat'> = {},
  nextraOptions: Pick<
    LoaderOptions,
    'unstable_staticImage' | 'unstable_flexsearch'
  > = {},
  resourcePath = ''
) {
  const structurizedData = {}
  const compiler = createCompiler({
    jsx: mdxOptions.jsx ?? true,
    outputFormat: mdxOptions.outputFormat,
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [
      ...(mdxOptions.remarkPlugins || []),
      remarkGfm,
      remarkHeadings,
      ...(nextraOptions.unstable_staticImage ? [remarkStaticImage] : []),
      ...(nextraOptions.unstable_flexsearch
        ? [structurize(structurizedData, nextraOptions.unstable_flexsearch)]
        : [])
    ].filter(Boolean),
    // @ts-ignore
    rehypePlugins: [
      ...(mdxOptions.rehypePlugins || []),
      parseMeta,
      [
        rehypePrettyCode,
        { ...rehypePrettyCodeOptions, ...mdxOptions.rehypePrettyCodeOptions }
      ],
      [rehypeMdxTitle, { name: 'titleText' }],
      attachMeta
    ].filter(Boolean)
  })
  try {
    const result = String(await compiler.process(source))
      .replace('export const titleText =', 'const titleText =')
      .replace('export default MDXContent;', '')

    return {
      result,
      ...(compiler.data('headingMeta') as Pick<
        PageOpts,
        'headings' | 'hasJsxInH1'
      >),
      structurizedData
    }
  } catch (err) {
    console.error(`[nextra] Error compiling ${resourcePath}.`)
    throw err
  }
}
