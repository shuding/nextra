import { compileMdx } from './compile'

export async function buildDynamicMDX(
  content: string,
  loaderOptions: Parameters<typeof compileMdx>[1]
) {
  if (loaderOptions && 'remarkLinkRewriteOptions' in loaderOptions) {
    throw new Error(`\`remarkLinkRewriteOptions\` was removed. For overriding internal links use \`remarkLinkRewrite\` instead.

import { remarkLinkRewrite } from 'nextra/mdx-plugins'

// ...

const result = await buildDynamicMDX(rawMdx, {
  mdxOptions: {
    remarkPlugins: [
      [remarkLinkRewrite, {
        pattern: /^\\/docs(\\/.*)?$/,
        replace: '/docs/2.0.0$1'
      }]
    ]
  }
})
`)
  }

  const { result, headings, frontMatter, title } = await compileMdx(
    content,
    loaderOptions
  )

  return {
    __nextra_dynamic_mdx: result,
    __nextra_dynamic_opts: JSON.stringify({
      headings,
      frontMatter,
      title: frontMatter.title || title
    })
  }
}

export async function buildDynamicMeta() {
  const resolvePageMap = globalThis.__nextra_resolvePageMap
  if (resolvePageMap) {
    return {
      __nextra_pageMap: await resolvePageMap()
    }
  }
  return {}
}
