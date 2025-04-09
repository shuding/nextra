import { notFound } from 'next/navigation'
import { useMDXComponents as getMDXComponents } from 'nextra-theme-docs'
import { compileMdx } from 'nextra/compile'
import { Callout, Tabs } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import {
  convertToPageMap,
  mergeMetaWithPageMap,
  normalizePageMap
} from 'nextra/page-map'
import json from '../../../../../nextra-remote-filepaths/graphql-yoga.json'

const { branch, docsPath, filePaths, repo, user } = json

const { mdxPages, pageMap: _pageMap } = convertToPageMap({
  filePaths,
  basePath: 'remote/graphql-yoga'
})

// @ts-expect-error -- fixme
const [yogaPage] = _pageMap[0].children

const yogaPageMap = mergeMetaWithPageMap(yogaPage, {
  index: 'Quick Start',
  features: {
    items: {
      graphiql: '',
      context: 'GraphQL Context',
      'error-masking': '',
      subscriptions: '',
      'file-uploads': '',
      'envelop-plugins': '',
      testing: '',
      'apollo-federation': '',
      cors: ''
    }
  },
  integrations: {
    items: {
      'integration-with-aws-lambda': 'AWS Lambda',
      'integration-with-cloudflare-workers': 'Cloudflare Workers',
      'integration-with-deno': 'Deno',
      'integration-with-express': 'Express',
      'integration-with-fastify': 'Fastify',
      'integration-with-koa': 'Koa',
      'integration-with-nestjs': 'NestJS',
      'integration-with-nextjs': 'Next.js',
      'integration-with-sveltekit': 'SvelteKit',
      'z-other-environments': 'Other Environments'
    }
  },
  migration: {
    items: {
      'migration-from-apollo-server': 'Apollo Server',
      'migration-from-express-graphql': 'Express GraphQL',
      'migration-from-yoga-v1': 'Yoga v1'
    }
  }
})

export const pageMap = normalizePageMap(yogaPageMap)

const { wrapper: Wrapper, ...components } = getMDXComponents({
  Callout,
  Tabs,
  Tab: Tabs.Tab,
  PackageCmd: () => null
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
