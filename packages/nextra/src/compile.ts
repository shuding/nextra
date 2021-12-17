import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import { remarkMdxCodeMeta } from 'remark-mdx-code-meta'
import { remarkStaticImage } from './static-image'
import getHeaders from './get-headers'
import { Heading } from 'mdast'
import { LoaderOptions } from './types'
export async function compileMdx(
  source: string,
  mdxOptions: LoaderOptions['mdxOptions'] = {},
  nextraOptions: { unstable_staticImage: boolean } = {
    unstable_staticImage: false
  }
) {
  let headings: Heading[] = []
  const result = await compile(source, {
    jsx: true,
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [
      ...(mdxOptions.remarkPlugins || []),
      remarkGfm,
      remarkMdxCodeMeta,
      getHeaders(headings),
      ...(nextraOptions.unstable_staticImage ? [remarkStaticImage] : [])
    ].filter(Boolean),
    rehypePlugins: [...(mdxOptions.rehypePlugins || [])].filter(Boolean)
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
          hasH1: true
        }
      }
    }
    return {
      result: String(result),
      headings: headings,
      hasH1: h1 ? true : false
    }
  }
  return {
    result: String(result),
    hasH1: false
  }
}
