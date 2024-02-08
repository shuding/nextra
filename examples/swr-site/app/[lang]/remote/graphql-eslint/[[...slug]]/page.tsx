import { notFound } from 'next/navigation'
import { useMDXComponents } from 'nextra-theme-docs'
import { compileMdx } from 'nextra/compile'
import { Callout, evaluate, Tabs } from 'nextra/components'
import { generatePageMapFromFilepaths } from 'nextra/page-map'
import json from '../../../../../nextra-remote-filepaths/graphql-eslint.json'

const { branch, docsPath, filePaths, repo, user } = json

const { pageMap, mdxPages } = generatePageMapFromFilepaths(
  filePaths.map(filePath => `graphql-eslint/${filePath}`)
)

export { pageMap }

export default async function Page({ params: { slug = [] } }) {
  const route = ['graphql-eslint', ...slug].join('/')
  const filePath = mdxPages[route]?.replace('graphql-eslint/', '')

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

  const { wrapper: Wrapper, ...components } = useMDXComponents({
    $Tabs: Tabs,
    Callout
  })

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
