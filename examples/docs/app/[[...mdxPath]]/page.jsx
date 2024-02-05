/* eslint-env node */

import { useMDXComponents } from 'nextra-theme-docs'

export async function generateStaticParams() {
  const { RouteToFilepath } = await import(
    '../../.next/static/chunks/nextra-page-map-.mjs'
  )
  return Object.keys(RouteToFilepath).map(mdxPath => ({
    mdxPath: mdxPath.split('/')
  }))
}

export async function generateMetadata({ params: { mdxPath } }) {
  const { metadata } = await loadPage(mdxPath)
  return metadata
}

export default async function Page({ params: { mdxPath } }) {
  const {
    default: MDXContent,
    useTOC,
    metadata,
    title,
    ..._props
  } = await loadPage(mdxPath)

  const { wrapper: Wrapper } = useMDXComponents()

  return (
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent />
    </Wrapper>
  )
}

async function loadPage(mdxPath = []) {
  const { RouteToFilepath } = await import(
    '../../.next/static/chunks/nextra-page-map-.mjs'
  )
  return await import(`../../mdx/${RouteToFilepath[mdxPath.join('/')]}`)
}
