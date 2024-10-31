/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */
import { notFound } from 'next/navigation'
import { compileMdx } from 'nextra/compile'
import { Callout, evaluate, Tabs } from 'nextra/components'
import { generatePageMap } from 'nextra/page-map'
import { useMDXComponents } from '../../../../../mdx-components'
import json from '../../../../../nextra-remote-filepaths/graphql-eslint.json'

const { branch, docsPath, filePaths, repo, user } = json

const { mdxPages } = generatePageMap({ filePaths })

const res = generatePageMap({
  filePaths: filePaths.map(filePath => `remote/graphql-eslint/${filePath}`)
})

export const pageMap = (res.pageMap[0] as any).children

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
  const { result } = await compileMdx(data, {
    filePath
  })

  const { default: MDXContent, useTOC, metadata, title } = evaluate(result)

  const { wrapper: Wrapper, ...components } = useMDXComponents({
    $Tabs: Tabs,
    Callout
  })
  return (
    <Wrapper toc={useTOC()} metadata={metadata} title={title}>
      <MDXContent components={components} />
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
