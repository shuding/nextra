/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents/useTOC are not react hooks */
import { notFound } from 'next/navigation'
import { useMDXComponents } from 'nextra-theme-docs'
import { compileMdx } from 'nextra/compile'
import { Callout, evaluate, Tabs } from 'nextra/components'
import { generatePageMapFromFilepaths } from 'nextra/page-map'
import json from '../../../../../nextra-remote-filepaths/graphql-yoga.json'

const { branch, docsPath, filePaths, repo, user } = json

const { mdxPages } = generatePageMapFromFilepaths(filePaths)

const res = generatePageMapFromFilepaths(
  filePaths.map(filePath => `remote/graphql-yoga/${filePath}`)
)

export const pageMap = res.pageMap[0].children

export default async function Page({ params: { slug = [] } }) {
  const route = slug.join('/')
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

  const { default: MDXContent, useTOC, ...props } = evaluate(result)

  const { wrapper, ...components } = useMDXComponents({
    // @ts-expect-error
    Callout,
    Tabs,
    Tab: Tabs.Tab,
    PackageCmd: () => null
  })
  // TODO: fixme
  const Wrapper = wrapper!

  return (
    <Wrapper toc={useTOC()} {...props}>
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
