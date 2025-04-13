// @ts-expect-error -- fixme
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import type { MdxFile } from 'nextra'
import { compileMdx } from 'nextra/compile'
import { Callout } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import type { GeneratedFunction } from 'nextra/tsdoc'
import { generateDocumentation, TSDoc } from 'nextra/tsdoc'
import type { FC } from 'react'

const API_REFERENCE = [
  { functionName: 'nextra', packageName: 'nextra' },
  { functionName: 'getPageMap', packageName: 'nextra/page-map' },
  { functionName: 'generateStaticParamsFor', packageName: 'nextra/pages' },
  { functionName: 'importPage', packageName: 'nextra/pages' },
  { functionName: 'compileMdx', packageName: 'nextra/compile' },
  { functionName: 'middleware', packageName: 'nextra/locales' },
  { functionName: 'evaluate', packageName: 'nextra/evaluate' },
  { functionName: 'normalizePages', packageName: 'nextra/normalize-pages' }
].map(o => ({
  ...o,
  slug: toKebabCase(o.functionName)
}))

function toKebabCase(str: string) {
  return str
    .replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2') // camelCase → camel-Case
    .toLowerCase()
}

export const generateStaticParams = () =>
  API_REFERENCE.map(o => ({ name: o.slug }))

export const pageMap: (MdxFile & { title: string })[] = API_REFERENCE.map(
  o => ({
    name: o.slug,
    route: `/api/${o.slug}`,
    title: o.functionName
  })
)
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
  const functionName =
    apiRef.functionName === 'nextra'
      ? 'default'
      : `${apiRef.functionName} as default`
  const {
    signatures,
    description,
    tags = {}
  } = generateDocumentation({
    code: `export { ${functionName} } from '${apiRef.packageName}'`,
    flattened: true
  }) as GeneratedFunction

  const result = [
    description &&
      // og:description
      `export const metadata = { description: ${JSON.stringify(description.split('\n', 1)[0])} }`,
    // Title
    `# \`${apiRef.functionName}\` function`,
    // Page description
    description,
    // Signature
    '## Signature',
    '<TSDoc definition={definition} />',
    // Warnings
    tags.throws &&
      `> [!WARNING]
>
> Throws an ${tags.throws.replaceAll('{', '`').replaceAll('}', '`')}`,
    // Tips
    tags.see &&
      `<Callout>
**See**

${tags.see}
</Callout>`,
    // Examples
    tags.example &&
      `## Example

${tags.example}`
  ].filter(Boolean)

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
      <MDXContent />
    </Wrapper>
  )
}

export default Page
