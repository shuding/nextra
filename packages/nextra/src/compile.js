import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import { remarkMdxCodeMeta } from 'remark-mdx-code-meta'

import { remarkStaticImage } from './static-image'

export async function compileMdx(source, mdxOptions = {}, nextraOptions = {}) {
  return String(
    await compile(source, {
      jsx: true,
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [
        ...(mdxOptions.remarkPlugins || []),
        remarkGfm,
        remarkMdxCodeMeta,
        nextraOptions.unstable_staticImage && remarkStaticImage
      ].filter(Boolean)
    })
  )
}
