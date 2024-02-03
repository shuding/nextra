/* eslint-env node */

import { useMDXComponents } from 'nextra-theme-docs'

// export function generateStaticParams() {
//   return Object.keys(FileMap).map(mdxPath : ({ mdxPath: mdxPath.split('/') }))
// }

export async function generateMetadata({ params: { mdxPath = [''], lang } }) {
  const { RouteToFilepath } = await import(
    `../../../.next/static/chunks/nextra-page-map-${'en'}.mjs`
  )

  // Can't use destructuring
  const result = await import(
    `../../../mdx/en/${RouteToFilepath[[lang, ...mdxPath].join('/')]}`
  )
  return result.metadata
}

export default async function Page({ params: { mdxPath = [''], lang } }) {
  const { RouteToFilepath } = await import(
    `../../../.next/static/chunks/nextra-page-map-${'en'}.mjs`
  )

  const {
    default: MDXContent,
    useTOC,
    metadata,
    title,
    ...props
  } = await import(
    `../../../mdx/en/${RouteToFilepath[[lang, ...mdxPath].join('/')]}`
  )

  const { wrapper: Wrapper, ...components } = useMDXComponents()

  return (
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent components={components} />
    </Wrapper>
  )
}
