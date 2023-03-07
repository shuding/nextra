import { compileMdx } from './compile'
import type { RemarkLinkRewriteOptions } from './mdx-plugins'
import { remarkLinkRewrite } from './mdx-plugins'
import { truthy } from './utils'

export const buildDynamicMDX = async (
  content: string,
  {
    remarkLinkRewriteOptions,
    ...loaderOptions
  }: Parameters<typeof compileMdx>[1] & {
    remarkLinkRewriteOptions?: RemarkLinkRewriteOptions
  } = {}
) => {
  const { result, headings, frontMatter, title } = await compileMdx(content, {
    ...loaderOptions,
    mdxOptions: {
      ...loaderOptions.mdxOptions,
      remarkPlugins: [
        ...(loaderOptions.mdxOptions?.remarkPlugins || []),
        remarkLinkRewriteOptions &&
          ([remarkLinkRewrite, remarkLinkRewriteOptions] as any)
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
