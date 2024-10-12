/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */

import { useMDXComponents } from 'nextra-theme-docs'
import { getPagesPaths, importPage } from 'nextra/pages'

export async function generateStaticParams() {
  const en = await getPagesPaths('en')
  const es = await getPagesPaths('es')
  const ru = await getPagesPaths('ru')

  const result = Object.entries({ en, es, ru }).flatMap(([lang, routes]) => {
    return routes.map(mdxPath => ({
      lang,
      ...(mdxPath && { mdxPath: mdxPath.split('/') })
    }))
  })

  return result
}

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
