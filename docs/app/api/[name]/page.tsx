// @ts-expect-error
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import { compileMdx } from 'nextra/compile'
import { Callout } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import { GeneratedFunction, generateDocumentation, TSDoc } from 'nextra/tsdoc'
import type { FC } from 'react'

// export const generateStaticParams = generateStaticParamsFor('mdxPath')

const API_REFERENCE = [
  {
    functionName: 'getPageMap',
    packageName: 'nextra/page-map'
  },
  {
    functionName: 'generateStaticParamsFor',
    packageName: 'nextra/pages'
  },
  {
    functionName: 'importPage',
    packageName: 'nextra/pages'
  },
  {
    functionName: 'compileMdx',
    packageName: 'nextra/compile'
  },
  {
    functionName: 'middleware',
    packageName: 'nextra/locales'
  },
  {
    functionName: 'evaluate',
    packageName: 'nextra/evaluate'
  },
  {
    functionName: 'normalizePages',
    packageName: 'nextra/normalize-pages'
  }
].map(o => ({
  ...o,
  slug: toKebabCase(o.functionName)
}))

function toKebabCase(str: string) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // camelCase → camel-Case
    .toLowerCase()
}

export const generateStaticParams = () =>
  API_REFERENCE.map(o => ({ name: o.slug }))

export const pageMap = API_REFERENCE.map(o => ({
  name: o.slug,
  route: `/api/${o.slug}`,
  title: o.functionName
}))

pageMap.unshift({
  route: '/api',
  name: 'index',
  title: 'Overview'
})

const { wrapper: Wrapper, ...components } = getMDXComponents({
  TSDoc,
  Callout
})

async function getReference(props: PageProps) {
  const params = await props.params
  const apiRef = API_REFERENCE.find(o => o.slug === params.name)
  if (!apiRef) {
    throw new Error(`API reference not found for "${params.name}"`)
  }
  const {
    signatures,
    description,
    tags = {}
  } = generateDocumentation({
    code: `export { ${apiRef.functionName} as default } from '${apiRef.packageName}'`,
    flattened: true
  }) as GeneratedFunction
  const result = [`# \`${apiRef.functionName}\` function`]
  if (description) {
    result.push(description)
  }
  result.push('## Signature', '<TSDoc definition={definition} />')
  if (tags.throws) {
    result.push(`> [!WARNING]
>
> Throws an ${tags.throws.replaceAll('{', '`').replaceAll('}', '`')}`)
  }
  if (tags.see) {
    result.push(`<Callout>
**See**
{''}
${tags.see}
</Callout>`)
  }
  if (tags.example) {
    result.push(`## Example
{''}
${tags.example}`)
  }
  const rawJs = await compileMdx(result.join('\n\n'))
  return evaluate(rawJs, components, { definition: { signatures, tags } })
}

export async function generateMetadata(props: PageProps) {
  const { metadata } = await getReference(props)
  return metadata
}

type PageProps = Readonly<{
  params: Promise<{
    name: string
    lang: string
  }>
}>

const Page: FC<PageProps> = async props => {
  const { default: MDXContent, toc, metadata } = await getReference(props)
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} />
    </Wrapper>
  )
}

export default Page
