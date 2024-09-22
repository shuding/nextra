/* eslint-env node */
/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Heading } from 'nextra'
import { useMDXComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'nextra/mdx'
import type { FC } from 'react'

export async function generateStaticParams() {
  const en = await import('.next/static/chunks/nextra-page-map-en.mjs')
  const es = await import('.next/static/chunks/nextra-page-map-es.mjs')
  const ru = await import('.next/static/chunks/nextra-page-map-ru.mjs')

  return Object.entries({ en, es, ru }).flatMap(
    ([lang, { RouteToFilepath }]) => {
      return Object.keys(RouteToFilepath).map(mdxPath => ({
        lang,
        ...(mdxPath && { mdxPath: mdxPath.split('/') })
      }))
    }
  )
}

export async function generateMetadata({
  params: { mdxPath, lang }
}: PageProps) {
  const { metadata } = await loadPage(lang, mdxPath)
  return metadata
}

type PageProps = {
  params: {
    mdxPath: string[]
    lang: string
  }
}

export default async function Page(pageProps: PageProps) {
  const { mdxPath, lang } = pageProps.params

  const {
    default: MDXContent,
    useTOC,
    metadata,
    title,
    ..._props
  } = await loadPage(lang, mdxPath)

  const { wrapper: Wrapper } = useMDXComponents()

  return (
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent {...pageProps} />
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
    `.next/static/chunks/nextra-page-map-${lang}.mjs`
  )
  try {
    return await import(
      `../../../mdx/${lang}/${RouteToFilepath[mdxPath.join('/')]}`
    )
  } catch {
    notFound()
  }
}
