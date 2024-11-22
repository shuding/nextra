/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents are not react hooks */
import { notFound } from 'next/navigation'
import { compileMdx } from 'nextra/compile'
import { Callout, Tabs } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import {
  convertToPageMap,
  mergeMetaWithPageMap,
  normalizePageMap
} from 'nextra/page-map'
import { useMDXComponents } from '../../../../../mdx-components'
import json from '../../../../../nextra-remote-filepaths/graphql-eslint.json'

const { branch, docsPath, filePaths, repo, user } = json

const { mdxPages, pageMap: _pageMap } = convertToPageMap({
  filePaths,
  basePath: 'remote/graphql-eslint'
})

// @ts-expect-error -- fixme
export const [eslintPage] = _pageMap[0].children

const eslintPageMap = mergeMetaWithPageMap(eslintPage, {
  index: 'Introduction',
  'getting-started': {
    title: 'Getting Started',
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

const { wrapper: Wrapper, ...components } = useMDXComponents({
  $Tabs: Tabs,
  Callout
})

export default async function Page(props) {
  const params = await props.params
  const route = (params.slug || []).join('/')
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
