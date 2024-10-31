/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */
import { notFound } from 'next/navigation'
import { useMDXComponents } from 'nextra-theme-docs'
import { compileMdx } from 'nextra/compile'
import { Callout, evaluate, Tabs } from 'nextra/components'
import { convertToPageMap, normalizePageMap } from 'nextra/page-map'
import json from '../../../../../nextra-remote-filepaths/graphql-yoga.json'

const { branch, docsPath, filePaths, repo, user } = json

const result = convertToPageMap({
  filePaths,
  basePath: 'remote/graphql-yoga'
})

export const pageMap = normalizePageMap((result.pageMap[0] as any).children)

const { wrapper: Wrapper, ...components } = useMDXComponents({
  Callout,
  Tabs,
  Tab: Tabs.Tab,
  PackageCmd: () => null
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
  const { result } = await compileMdx(data, { filePath })

  const { default: MDXContent, useTOC, metadata, title } = evaluate(result)
  return (
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent components={components} />
    </Wrapper>
  )
}

export function generateStaticParams() {
  const params = Object.keys(result.mdxPages).map(route => ({
    lang: 'en',
    ...(route && { slug: route.split('/') })
  }))

  return params
}
