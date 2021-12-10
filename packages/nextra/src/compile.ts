import { compile, CompileOptions } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import { remarkMdxCodeMeta } from 'remark-mdx-code-meta'

import { remarkStaticImage } from './static-image'

export async function compileMdx(
  source: string,
  mdxOptions: CompileOptions = {},
  nextraOptions: { unstable_staticImage: boolean } = {
    unstable_staticImage: false
  }
) {
  return String(
    await compile(source, {
      jsx: true,
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [
        ...(mdxOptions.remarkPlugins || []),
        remarkGfm,
        remarkMdxCodeMeta,
        ...(nextraOptions.unstable_staticImage ? [remarkStaticImage] : [])
      ].filter(Boolean)
    })
  )
}
