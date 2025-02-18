import { notFound } from 'next/navigation'
import { compileMdx } from 'nextra/compile'
import { Callout, Tabs } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import {
  convertToPageMap,
  mergeMetaWithPageMap,
  normalizePageMap
} from 'nextra/page-map'
import { useMDXComponents as getMDXComponents } from '../../../../mdx-components'

const user = 'graphql-hive'
const repo = 'graphql-eslint'
const branch = '34b722a2a520599ce06a4ddcccc9623b76434089'
const docsPath = 'website/src/pages/docs/'
const filePaths = [
  'configs.mdx',
  'custom-rules.mdx',
  'getting-started.mdx',
  'getting-started/parser-options.mdx',
  'getting-started/parser.mdx',
  'index.mdx'
]

const { mdxPages, pageMap: _pageMap } = convertToPageMap({
  filePaths,
  basePath: 'graphql-eslint'
})

// `mergeMetaWithPageMap` is used to change sidebar order and title
const eslintPageMap = mergeMetaWithPageMap(_pageMap[0]!, {
  index: 'Introduction',
  'getting-started': {
    items: {
      index: 'Overview',
      'parser-options': '',
      parser: ''
    }
  },
  configs: '',
  'custom-rules': ''
})

export const pageMap = normalizePageMap(eslintPageMap)

const { wrapper: Wrapper, ...components } = getMDXComponents({
  $Tabs: Tabs,
  Callout
})

type PageProps = Readonly<{
  params: Promise<{
    slug?: string[]
  }>
}>

export default async function Page(props: PageProps) {
  const params = await props.params
  const route = params.slug?.join('/') ?? ''
  const filePath = mdxPages[route]

  if (!filePath) {
    notFound()
  }
  const response = await fetch(
    `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${docsPath}${filePath}`
  )
  const data = await response.text()
  const rawJs = await compileMdx(data, { filePath })
  const { default: MDXContent, toc, metadata } = evaluate(rawJs, components)

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent />
    </Wrapper>
  )
}

export function generateStaticParams() {
  const params = Object.keys(mdxPages).map(route => ({
    lang: 'en',
    ...(route && { slug: route.split('/') })
  }))

  return params
}
