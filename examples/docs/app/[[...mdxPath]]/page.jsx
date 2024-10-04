/* eslint-env node */
/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */

import { importPage } from 'nextra'
import { useMDXComponents } from 'nextra-theme-docs'
import { RouteToPage } from 'private-dot-next/static/chunks/nextra-pages-.mjs'

export function generateStaticParams() {
  return Object.keys(RouteToPage).map(mdxPath => ({
    mdxPath: mdxPath.split('/')
  }))
}

export async function generateMetadata({ params: { mdxPath } }) {
  const { metadata } = await importPage(mdxPath)
  return metadata
}

export default async function Page({ params: { mdxPath } }) {
  const {
    default: MDXContent,
    useTOC,
    metadata,
    title
  } = await importPage(mdxPath)

  const Wrapper = useMDXComponents().wrapper

  return (
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent />
    </Wrapper>
  )
}