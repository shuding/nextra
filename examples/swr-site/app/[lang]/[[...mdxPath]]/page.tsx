/* eslint-env node */

import { ExampleDynamicMarkdownImport } from '@app/_components/example-dynamic-markdown-import'
import { Video } from '@app/_components/video'
import type { Metadata } from 'next'
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
    ...props
  } = await loadPage(lang, mdxPath)

  const { wrapper: Wrapper, ...components } = useMDXComponents()

  return (
    // @ts-expect-error -- fixme
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent
        components={{
          ...components,
          // fixes Error: Could not find the module "nextra/examples/swr-site/app/_components/video.tsx#Video" in the React Client Manifest.
          // This is probably a bug in the React Server Components bundler.
          Video,
          ExampleDynamicMarkdownImport
        }}
        {...pageProps}
      />
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
  return await import(
    `../../../mdx/${lang}/${RouteToFilepath[mdxPath.join('/')]}`
  )
}
