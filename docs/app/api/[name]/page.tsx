// @ts-expect-error -- fixme
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import type { MdxFile } from 'nextra'
import { compileMdx } from 'nextra/compile'
import { Callout } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import { generateDocumentation, TSDoc } from 'nextra/tsdoc'
import type { FC } from 'react'

const API_REFERENCE = [
  {
    name: 'nextra',
    packageName: 'nextra',
    exportName: 'default',
    isFlattened: false
  },
  { name: 'getPageMap', packageName: 'nextra/page-map' },
  { name: 'generateStaticParamsFor', packageName: 'nextra/pages' },
  { name: 'importPage', packageName: 'nextra/pages' },
  { name: 'compileMdx', packageName: 'nextra/compile' },
  { name: 'middleware', packageName: 'nextra/locales' },
  { name: 'evaluate', packageName: 'nextra/evaluate' },
  { name: 'normalizePages', packageName: 'nextra/normalize-pages' }
].map(o => ({
  ...o,
  slug: toKebabCase(o.name)
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
    title: o.name
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
  const code = `export { ${apiRef.exportName ?? apiRef.name} as default } from '${apiRef.packageName}'`
  const {
    description,
    // @ts-expect-error -- fixme
    tags = {},
    // @ts-expect-error -- fixme
    signatures
  } = generateDocumentation({
    code,
    flattened: apiRef.isFlattened !== false
  })

  const result = [
    description &&
      // og:description
      `export const metadata = { description: ${JSON.stringify(description.split('\n', 1)[0])} }`,
    // Title
    `# \`${apiRef.name}\` function`,
    // Page description
    description,
    `Exported from \`${apiRef.packageName}\`.`,
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
  return evaluate(rawJs, components, {
    definition: { signatures, tags }
  })
}

export async function generateMetadata(props: PageProps) {
  const { metadata } = await getReference(props)
  return metadata
}

type PageProps = Readonly<{
  params: Promise<{ name: string }>
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
