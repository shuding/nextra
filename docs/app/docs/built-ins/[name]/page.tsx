// @ts-expect-error -- fixme
import { getEnhancedPageMap } from '@components/get-page-map'
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import type { MdxFile } from 'nextra'
import { Folder } from 'nextra'
import { compileMdx } from 'nextra/compile'
import { Callout } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import { generateDefinition, TSDoc } from 'nextra/tsdoc'
import type { FC } from 'react'

const API_REFERENCE = [
  { type: 'separator', title: 'Types', name: '_' },
  { name: 'NextraConfig', packageName: 'nextra', isFlattened: false },
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
  { name: 'generateDefinition', packageName: 'nextra/tsdoc' },
  { name: 'middleware', packageName: 'nextra/locales' },
  { name: 'evaluate', packageName: 'nextra/evaluate' },
  { name: 'normalizePages', packageName: 'nextra/normalize-pages' }
]

const functionsIndex = API_REFERENCE.findIndex(o => o.title === 'Functions')

const routes = API_REFERENCE.filter(o => 'name' in o)

export const generateStaticParams = () =>
  routes.map(o => ({ name: o.name.toLowerCase() }))

// @ts-expect-error -- fixme
export const pageMap: (MdxFile & { title: string })[] = API_REFERENCE.map(o =>
  'type' in o
    ? o
    : {
        name: o.name.toLowerCase(),
        route: `/docs/built-ins/${o.name.toLowerCase()}`,
        title: o.name
      }
)

const { wrapper: Wrapper, ...components } = getMDXComponents({
  TSDoc,
  Callout
})

async function getReference(props: PageProps) {
  const params = await props.params
  const apiRefIndex = routes.findIndex(
    o => o.name.toLowerCase() === params.name
  )
  const apiRef = API_REFERENCE[apiRefIndex]
  if (!apiRef) {
    throw new Error(`API reference not found for "${params.name}"`)
  }
  const {
    description,
    // @ts-expect-error -- fixme
    tags = {},
    ...rest
  } = generateDefinition({
    code:
      apiRef.code ??
      `export { ${apiRef.name} as default } from '${apiRef.packageName}'`,
    flattened: apiRef.isFlattened !== false
  })
  const isType = functionsIndex > apiRefIndex

  const result = [
    description &&
      // og:description
      `export const metadata = { description: ${JSON.stringify(description.split('\n', 1)[0])} }`,
    // Title
    `# \`${apiRef.name}\` ${isType ? 'type' : 'function'}`,
    // Page description
    description,
    apiRef.packageName && `Exported from \`${apiRef.packageName}\`.`,
    // Signature
    `## ${isType ? 'Fields' : 'Signature'}`,
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
  // TODO pass `'/api'` as first argument
  const pageMap = await getEnhancedPageMap()
  const apiPageMap = pageMap.find(
    (o): o is Folder => 'name' in o && o.name === 'api'
  )!.children
  const typeLinkMap = apiPageMap
    .filter(o => 'route' in o && o.name !== 'index')
    // @ts-expect-error -- fixme
    .map(o => [o.title, o.route])
  typeLinkMap.push(
    [
      'NextConfig',
      'https://nextjs.org/docs/pages/api-reference/config/next-config-js'
    ],
    ['RehypePrettyCodeOptions', 'https://rehype-pretty.pages.dev/#options'],
    ['PluggableList', 'https://github.com/unifiedjs/unified#pluggablelist']
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
