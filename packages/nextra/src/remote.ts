import { compileMdx } from './compile'
import { LoaderOptions } from './types'
import { remarkLinkRewrite, RemarkLinkRewriteOptions } from './mdx-plugins'
import { truthy } from './utils'

export const buildDynamicMDX = async (
  content: string,
  {
    remarkLinkRewriteOptions,
    ...loaderOptions
  }: Pick<LoaderOptions, 'latex' | 'codeHighlight' | 'defaultShowCopyCode'> & {
    remarkLinkRewriteOptions?: RemarkLinkRewriteOptions
  } = {}
) => {
  const { result, headings, frontMatter, title } = await compileMdx(content, {
    ...loaderOptions,
    mdxOptions: {
      remarkPlugins: [
        remarkLinkRewriteOptions && [
          remarkLinkRewrite,
          remarkLinkRewriteOptions
        ] as any
      ].filter(truthy)
    }
  })

  return {
    __nextra_dynamic_mdx: result,
    __nextra_dynamic_opts: JSON.stringify({
      headings,
      frontMatter,
      title: frontMatter.title || title
    })
  }
}

export const buildDynamicMeta = async () => {
  const resolvePageMap = (globalThis as any).__nextra_resolvePageMap
  if (resolvePageMap) {
    return {
      __nextra_pageMap: await resolvePageMap()
    }
  }
  return {}
}
