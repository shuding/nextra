import { compile, nodeTypes } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import { createRemarkPlugin } from '@atomiks/mdx-pretty-code'
import { remarkStaticImage } from './static-image'
import getHeaders from './get-headers'
import { Heading } from 'mdast'
import { LoaderOptions } from './types'

import rehypeRaw from 'rehype-raw'
import structurize from './structurize'

// @ts-ignore
import theme from './theme.json'

const prettyCode = createRemarkPlugin({
  shikiOptions: {
    theme: theme as any
  },
  // onVisitLine(node: any) {
  //   // Style a line node.
  //   Object.assign(node.style, {
  //   })
  // },
  onVisitHighlightedLine(node: any) {
    // Style a highlighted line node.
    node.classList.add('highlighted')
  },
  onVisitHighlightedWord(node: any) {
    // Style a highlighted word node.
    node.classList.add('highlighted')
  }
})

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
        : []),
      prettyCode
    ].filter(Boolean),
    // @ts-ignore
    rehypePlugins: [
      ...(mdxOptions.rehypePlugins || []),
      [rehypeRaw, { passThrough: nodeTypes }]
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
