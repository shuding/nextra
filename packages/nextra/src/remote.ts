import { compileMdx } from './compile'

export const buildDynamicMDX = async (content: string) => {
  const mdx = await compileMdx(content)

  return {
    __nextra_dynamic_mdx: mdx.result,
    __nextra_dynamic_opts: JSON.stringify({
      headings: mdx.headings || [],
      frontMatter: mdx.frontMatter || {},
      title: mdx.frontMatter?.title || mdx.title
    })
  }
}

export const buildDynamicMeta = async () => {
  const resolvePageMap = (globalThis as any).__nextra_resolvePageMap__
  if (resolvePageMap) {
    return {
      __nextra_pageMap: await resolvePageMap()
    }
  }
  return {}
}
