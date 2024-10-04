/* eslint-env node */
/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */

import { getPagesPaths, importPage } from 'nextra'
import { useMDXComponents } from 'nextra-theme-docs'

export async function generateStaticParams() {
  return (await getPagesPaths()).map(mdxPath => ({
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
