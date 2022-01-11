import { compile, nodeTypes } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import { remarkStaticImage } from './mdx-plugins/static-image'
import getHeaders from './mdx-plugins/get-headers'
import { Heading } from 'mdast'
import { LoaderOptions } from './types'
import structurize from './mdx-plugins/structurize'
import { parseCodeMeta, attachCodeMeta } from './mdx-plugins/add-code-meta'

// @ts-ignore
import theme from './theme.json'

const rehypePrettyCodeOptions = {
  theme: theme,
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
    unstable_contentDump: boolean
  } = {
    unstable_staticImage: false,
    unstable_contentDump: false
  }
) {
  let headings: Heading[] = []
  let structurizedData = {}

  const result = await compile(source, {
    jsx: true,
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [
      ...(mdxOptions.remarkPlugins || []),
      remarkGfm,
      getHeaders(headings),
      ...(nextraOptions.unstable_staticImage ? [remarkStaticImage] : []),
      ...(nextraOptions.unstable_contentDump
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

  if (Array.isArray(headings) && headings.length > 0) {
    const h1 = headings.find(v => v.depth === 1)
    if (h1 && Array.isArray(h1.children) && h1.children.length === 1) {
      const child = h1.children[0]
      if (child.type === 'text') {
        return {
          result: String(result),
          titleText: child.value,
          headings: headings,
          hasH1: true,
          structurizedData
        }
      }
    }
    return {
      result: String(result),
      headings: headings,
      hasH1: h1 ? true : false,
      structurizedData
    }
  }

  return {
    result: String(result),
    hasH1: false,
    structurizedData
  }
}
