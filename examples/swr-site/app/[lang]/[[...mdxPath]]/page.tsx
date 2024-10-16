/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */

import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata({ params }: PageProps) {
  const { metadata } = await importPage(params.mdxPath, params.lang)
  return metadata
}

type PageProps = {
  params: {
    mdxPath: string[]
    lang: string
  }
}

export default async function Page(props: PageProps) {
  const { mdxPath, lang } = props.params
  const result = await importPage(mdxPath, lang)
  const { default: MDXContent, useTOC, metadata, title } = result
  const Wrapper = useMDXComponents().wrapper

  return (
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent {...props} />
    </Wrapper>
  )
}
