// @ts-expect-error -- fixme
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import type { MdxFile } from 'nextra'
import { compileMdx } from 'nextra/compile'
import { Callout } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import { getPageMap } from 'nextra/page-map'
import { generateDocumentation, TSDoc } from 'nextra/tsdoc'
import type { FC } from 'react'

const API_REFERENCE = [
  { type: 'separator', title: 'Types', name: '_' },
  {
    name: 'NextraConfig',
    packageName: 'nextra',
    isFlattened: false,
    isType: true
  },
  {
    name: 'MdxOptions',
    code: `import type { NextraConfig } from 'nextra'
type $ = NonNullable<NextraConfig['mdxOptions']>
export default $`,
    isFlattened: false
  },
  { type: 'separator', title: 'Functions', name: '_2' },
  {
    name: 'nextra',
    packageName: 'nextra',
    code: "export { default } from 'nextra'",
    isFlattened: false
  },
  { name: 'getPageMap', packageName: 'nextra/page-map' },
  { name: 'generateStaticParamsFor', packageName: 'nextra/pages' },
  { name: 'importPage', packageName: 'nextra/pages' },
  { name: 'compileMdx', packageName: 'nextra/compile' },
  { name: 'middleware', packageName: 'nextra/locales' },
  { name: 'evaluate', packageName: 'nextra/evaluate' },
  { name: 'normalizePages', packageName: 'nextra/normalize-pages' }
]

const routes = API_REFERENCE.filter(o => 'name' in o)

export const generateStaticParams = () =>
  routes.map(o => ({ name: o.name.toLowerCase() }))

// @ts-expect-error -- fixme
export const pageMap: (MdxFile & { title: string })[] = API_REFERENCE.map(o =>
  'type' in o
    ? o
    : {
        name: o.name.toLowerCase(),
        route: `/api/${o.name.toLowerCase()}`,
        title: o.name
      }
)

const { wrapper: Wrapper, ...components } = getMDXComponents({
  TSDoc,
  Callout
})

async function getReference(props: PageProps) {
  const params = await props.params
  const apiRef = routes.find(o => o.name.toLowerCase() === params.name)
  if (!apiRef) {
    throw new Error(`API reference not found for "${params.name}"`)
  }
  const {
    description,
    // @ts-expect-error -- fixme
    tags = {},
    ...rest
  } = generateDocumentation({
    code:
      apiRef.code ??
      `export { ${apiRef.name} as default } from '${apiRef.packageName}'`,
    flattened: apiRef.isFlattened !== false
  })

  const result = [
    description &&
      // og:description
      `export const metadata = { description: ${JSON.stringify(description.split('\n', 1)[0])} }`,
    // Title
    `# \`${apiRef.name}\` ${apiRef.isType ? 'type' : 'function'}`,
    // Page description
    description,
    apiRef.packageName && `Exported from \`${apiRef.packageName}\`.`,
    // Signature
    `## ${apiRef.isType ? 'Fields' : 'Signature'}`,
    '<TSDoc definition={definition} typeLinkMap={typeLinkMap} />',
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
  const typeLinkMap = (await getPageMap('/api'))
    .filter(o => 'route' in o && o.name !== 'index')
    // @ts-expect-error
    .map(o => [o.title, o.route])
  typeLinkMap.push(
    [
      'NextConfig',
      'https://nextjs.org/docs/pages/api-reference/config/next-config-js'
    ],
    ['RehypePrettyCodeOptions', 'https://rehype-pretty.pages.dev/#options']
  )

  const rawJs = await compileMdx(result.join('\n\n'))
  return evaluate(rawJs, components, {
    definition: { tags, ...rest },
    typeLinkMap: Object.fromEntries(typeLinkMap)
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
