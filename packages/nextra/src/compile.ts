import { createProcessor, ProcessorOptions } from '@mdx-js/mdx'
import { Processor } from '@mdx-js/mdx/lib/core'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import { remarkStaticImage } from './mdx-plugins/static-image'
import remarkHandler, { HeadingMeta } from './mdx-plugins/remark'
import { LoaderOptions } from './types'
import structurize from './mdx-plugins/structurize'
import { parseMeta, attachMeta } from './mdx-plugins/rehype-handler'
import theme from './theme.json'

const createCompiler = (mdxOptions: ProcessorOptions): Processor => {
  const compiler = createProcessor(mdxOptions)
  compiler.data('headingMeta', {
    hasH1: false,
    headings: []
  })
  return compiler
}

const rehypePrettyCodeOptions = {
  theme,
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }]
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push('highlighted')
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ['highlighted']
  }
}

type NextraOptions = {
  unstable_staticImage: boolean
  unstable_flexsearch: boolean | { codeblocks: boolean }
}

export async function compileMdx(
  source: string,
  mdxOptions: LoaderOptions['mdxOptions'] = {},
  nextraOptions: NextraOptions,
  resourcePath: string
) {
  let structurizedData = {}
  const compiler = createCompiler({
    jsx: true,
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [
      ...(mdxOptions.remarkPlugins || []),
      remarkGfm,
      remarkHandler,
      ...(nextraOptions.unstable_staticImage ? [remarkStaticImage] : []),
      ...(nextraOptions.unstable_flexsearch
        ? [structurize(structurizedData, nextraOptions.unstable_flexsearch)]
        : [])
    ].filter(Boolean),
    // @ts-ignore
    rehypePlugins: [
      ...(mdxOptions.rehypePlugins || []),
      parseMeta,
      [rehypePrettyCode, rehypePrettyCodeOptions],
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
    console.error(`\nError compiling ${resourcePath}\n${err}\n`)
    throw err
  }
}
