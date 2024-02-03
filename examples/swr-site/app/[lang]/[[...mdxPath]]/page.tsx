/* eslint-env node */

import { useMDXComponents } from 'nextra-theme-docs'

const FileMap = {
  blog: 'blog.mdx',
  '': 'index.mdx',
  'blog/swr-v1': 'blog/swr-v1.mdx',
  'docs/arguments': 'docs/arguments.mdx',
  'docs/change-log': 'docs/change-log.mdx',
  'docs/conditional-fetching': 'docs/conditional-fetching.md',
  'docs/data-fetching': 'docs/data-fetching.mdx',
  'docs/error-handling': 'docs/error-handling.mdx',
  'docs/getting-started': 'docs/getting-started.mdx',
  'docs/global-configuration': 'docs/global-configuration.md',
  'docs/middleware': 'docs/middleware.mdx',
  'docs/mutation': 'docs/mutation.md',
  'docs/options': 'docs/options.mdx',
  'docs/pagination': 'docs/pagination.mdx',
  'docs/prefetching': 'docs/prefetching.md',
  'docs/revalidation': 'docs/revalidation.mdx',
  'docs/suspense': 'docs/suspense.mdx',
  'docs/understanding': 'docs/understanding.mdx',
  'docs/with-nextjs': 'docs/with-nextjs.mdx',
  'docs/wrap-toc-items': 'docs/wrap-toc-items.mdx',
  'examples/auth': 'examples/auth.mdx',
  'examples/basic': 'examples/basic.mdx',
  'examples/error-handling': 'examples/error-handling.mdx',
  'examples/infinite-loading': 'examples/infinite-loading.mdx',
  'examples/ssr': 'examples/ssr.mdx',
  'docs/advanced/cache': 'docs/advanced/cache.mdx',
  'docs/advanced/file-name.with.DOTS': 'docs/advanced/file-name.with.DOTS.mdx',
  'docs/advanced/performance': 'docs/advanced/performance.mdx',
  'docs/advanced/react-native': 'docs/advanced/react-native.mdx'
}

// export function generateStaticParams() {
//   return Object.keys(FileMap).map(mdxPath : ({ mdxPath: mdxPath.split('/') }))
// }

// export async function generateMetadata({ params: { mdxPath = [''] } }) {
//   // Can't use destructuring
//   const result = await import(`../../mdx/${FileMap[mdxPath.join('/')]}`)
//   return result.metadata
// }

export default async function Page({ params: { mdxPath = [''], lang } }) {
  console.log({ mdxPath, lang })
  const {
    default: MDXContent,
    useTOC,
    metadata,
    title,
    ...props
  } = await import(`../../../mdx/en/${FileMap[[lang,...mdxPath].join('/')]}`)

  const { wrapper: Wrapper, ...components } = useMDXComponents()

  return (
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent components={components} />
    </Wrapper>
  )
}
