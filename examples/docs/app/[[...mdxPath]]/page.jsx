/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */

import { useMDXComponents } from 'nextra-theme-docs'
import { getPagesPaths, importPage } from 'nextra/pages'

export async function generateStaticParams() {
  return (await getPagesPaths()).map(mdxPath => ({
    mdxPath: mdxPath.split('/')
  }))
}

export async function generateMetadata(props) {
  const { metadata } = await importPage(props.params.mdxPath)
  return metadata
}

export default async function Page(props) {
  const result = await importPage(props.params.mdxPath)
  const { default: MDXContent, useTOC, metadata, title } = result

  const Wrapper = useMDXComponents().wrapper

  return (
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent {...props} />
    </Wrapper>
  )
}
