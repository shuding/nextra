import { createProcessor, ProcessorOptions } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import { rehypeMdxTitle } from 'rehype-mdx-title';
import { remarkStaticImage } from './mdx-plugins/static-image'
import { remarkHeadings, HeadingMeta } from './mdx-plugins/remark'
import { LoaderOptions } from './types'
import structurize from './mdx-plugins/structurize'
import { parseMeta, attachMeta } from './mdx-plugins/rehype-handler'

// @ts-ignore
import theme from './theme.json'

const createCompiler = (mdxOptions: ProcessorOptions) => {
  const compiler = createProcessor(mdxOptions)
  compiler.data('headingMeta', {
    headings: []
  })
  return compiler
}

const rehypePrettyCodeOptions = {
  theme,
  // onVisitLine(node: any) {
  //   // Style a line node.
  //   Object.assign(node.style, {
  //   })
  // },
  onVisitHighlightedLine(node: any) {
    // Style a highlighted line node.
    if (!node.properties.className) {
      node.properties.className = []
    }
    node.properties.className.push('highlighted')
  },
  onVisitHighlightedWord(node: any) {
    // Style a highlighted word node.
    if (!node.properties.className) {
      node.properties.className = []
    }
    node.properties.className.push('highlighted')
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
    const result = await compiler.process(source)
    return {
      result: String(result),
      ...(compiler.data('headingMeta') as HeadingMeta),
      structurizedData
    }
  } catch (err) {
    console.error(`[nextra] Error compiling ${resourcePath}.`)
    throw err
  }
}
