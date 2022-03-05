import { createProcessor, ProcessorOptions } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import { remarkStaticImage } from './mdx-plugins/static-image'
import remarkHeadings, { HeadingMeta } from './mdx-plugins/get-headers'
import { LoaderOptions } from './types'
import structurize from './mdx-plugins/structurize'
import { parseCodeMeta, attachCodeMeta } from './mdx-plugins/add-code-meta'

// @ts-ignore
import theme from './theme.json'

const createCompiler = (mdxOptions: ProcessorOptions) => {
  const compiler = createProcessor(mdxOptions)
  compiler.data('headingMeta', {
    hasH1: false,
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
  mdxOptions: LoaderOptions['mdxOptions'] = {},
  nextraOptions: {
    unstable_staticImage: boolean
    unstable_flexsearch: boolean
  } = {
    unstable_staticImage: false,
    unstable_flexsearch: false
  }
) {
  let structurizedData = {}
  const compiler = createCompiler({
    jsx: true,
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [
      ...(mdxOptions.remarkPlugins || []),
      remarkGfm,
      remarkHeadings,
      ...(nextraOptions.unstable_staticImage ? [remarkStaticImage] : []),
      ...(nextraOptions.unstable_flexsearch
        ? [structurize(structurizedData)]
        : [])
    ].filter(Boolean),
    // @ts-ignore
    rehypePlugins: [
      ...(mdxOptions.rehypePlugins || []),
      parseCodeMeta,
      [rehypePrettyCode, rehypePrettyCodeOptions],
      attachCodeMeta
    ].filter(Boolean)
  })
  const result = await compiler.process(source)
  return {
    result: String(result),
    ...(compiler.data('headingMeta') as HeadingMeta),
    structurizedData
  }
}
