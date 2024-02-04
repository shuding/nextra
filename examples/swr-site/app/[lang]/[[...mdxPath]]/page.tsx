/* eslint-env node */

import type { Metadata } from 'next'
import type { Heading } from 'nextra'
import { useMDXComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'nextra/mdx'
import type { FC } from 'react'

// export async function generateStaticParams() {
//   const { RouteToFilepath } = await import(
//     '../../../.next/static/chunks/nextra-page-map-en.mjs'
//   )
//
//   return Object.keys(RouteToFilepath).map(mdxPath => {
//     return {
//       lang: 'en',
//       ...(mdxPath && { mdxPath: mdxPath.split('/') })
//     }
//   })
// }

export async function generateMetadata({ params: { mdxPath, lang } }) {
  // Can't use destructuring
  const result = await loadPage(lang, mdxPath)
  return result.metadata
}

export default async function Page({
  params: { mdxPath, lang }
}: {
  params: {
    mdxPath: string[]
    lang: string
  }
}) {
  console.log('Page', { mdxPath })
  const {
    default: MDXContent,
    useTOC,
    metadata,
    title,
    ...props
  } = await loadPage(lang, mdxPath)

  const { wrapper: Wrapper, ...components } = useMDXComponents()

  return (
    // @ts-expect-error -- fixme
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent components={components} />
    </Wrapper>
  )
}

async function loadPage(
  lang,
  mdxPath: string[] = []
): Promise<{
  default: FC<{
    components?: MDXComponents
  }>
  useTOC: () => Heading[]
  metadata: Metadata
  title: string
}> {
  const { RouteToFilepath } = await import(
    '.next/static/chunks/nextra-page-map-en.mjs'
  )
  return import(`../../../mdx/${lang}/${RouteToFilepath[mdxPath.join('/')]}`)
}
