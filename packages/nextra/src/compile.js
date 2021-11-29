import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import { remarkMdxCodeMeta } from 'remark-mdx-code-meta'

export async function compileMdx(source, mdxOptions = {}) {
  return String(
    await compile(source, {
      jsx: true,
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [
        ...(mdxOptions.remarkPlugins || []),
        remarkGfm,
        remarkMdxCodeMeta
      ]
    })
  )
}
