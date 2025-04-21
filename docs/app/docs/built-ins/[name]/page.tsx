import { generateApiReference } from '@components/generate-api-reference'
import type { ApiReference } from '@components/generate-api-reference'
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import type { MdxFile } from 'nextra'
import { generateDefinition, generateTsFromZod } from 'nextra/tsdoc'
import { HeadPropsSchema } from 'private-next-root-dir/../packages/nextra/dist/client/components/head'
import type { FC } from 'react'

const API_REFERENCE: (
  | (ApiReference & { groupKeys?: string })
  | { type: 'separator'; title: string; name: string }
)[] = [
  { type: 'separator', title: 'Layout Components', name: '_' },
  {
    name: 'Banner',
    packageName: 'nextra/components',
    groupKeys: 'HTMLAttributes<HTMLDivElement>'
  },
  { name: 'Search', packageName: 'nextra/components', isFlattened: false },
  { type: 'separator', title: 'Content Components', name: '_2' },
  {
    name: 'Bleed',
    packageName: 'nextra/components',
    groupKeys: 'HTMLAttributes<HTMLDivElement>'
  },
  {
    name: 'Callout',
    packageName: 'nextra/components',
    groupKeys: 'HTMLAttributes<HTMLDivElement>'
  },
  {
    name: 'Steps',
    packageName: 'nextra/components',
    groupKeys: 'HTMLAttributes<HTMLDivElement>'
  },
  { name: 'Tabs', packageName: 'nextra/components' },
  {
    // TODO: add
    // <APIDocs componentName="FileTree.Folder" />
    // <APIDocs componentName="FileTree.File" />
    name: 'FileTree',
    packageName: 'nextra/components',
    groupKeys: 'HTMLAttributes<HTMLUListElement>'
  },
  {
    // TODO: add
    // <APIDocs componentName="Table.Tr" groupKeys="ComponentProps<'tr'>" />
    // <APIDocs componentName="Table.Th" groupKeys="ComponentProps<'th'>" />
    // <APIDocs componentName="Table.Td" groupKeys="ComponentProps<'td'>" />
    name: 'Table',
    packageName: 'nextra/components',
    groupKeys: 'HTMLAttributes<HTMLTableElement>'
  },
  {
    // TODO: add
    // <APIDocs componentName="Cards.Card" />
    name: 'Cards',
    packageName: 'nextra/components',
    groupKeys: 'HTMLAttributes<HTMLDivElement>'
  },
  {
    name: 'Head',
    packageName: 'nextra/components',
    isFlattened: true,
    // We use `code` otherwise, unable use generateDefinition.flattened
    code: `interface $ ${generateTsFromZod(HeadPropsSchema)}
export default $`
  },
  { type: 'separator', title: 'Other Components', name: '_4' },
  { name: 'Playground', packageName: 'nextra/components' },
  { name: 'TSDoc', packageName: 'nextra/tsdoc' }
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
        route: `/docs/built-ins/${o.name.toLowerCase()}`,
        title: o.name
      }
)

const Wrapper = getMDXComponents().wrapper

async function getReference(props: PageProps) {
  const params = await props.params
  const apiRefIndex = routes.findIndex(
    o => o.name.toLowerCase() === params.name
  )
  const apiRef = API_REFERENCE[apiRefIndex]
  if (!apiRef || 'type' in apiRef) {
    throw new Error(`API reference not found for "${params.name}"`)
  }
  const { name, packageName, groupKeys, isFlattened } = apiRef
  const result = groupKeys
    ? `Omit<MyProps, keyof ${groupKeys}> & { '...props': ${groupKeys} }>`
    : 'MyProps'
  const code =
    apiRef.code ??
    `
import type { ComponentProps, HTMLAttributes } from 'react'
import { ${name} as MyComponent } from '${packageName}'

type MyProps = ComponentProps<typeof MyComponent>
type $ = ${result}

export default $`
  const flattened = isFlattened !== false
  const fcPropsDefinition = generateDefinition({ code, flattened })
  const {
    // @ts-expect-error -- exist
    signatures: _signatures,
    ...fcDefinition
  } = generateDefinition({
    code: `export { ${name} as default } from '${packageName}'`,
    flattened
  })
  const definition = {
    ...fcPropsDefinition,
    ...fcDefinition
  }
  return generateApiReference(apiRef, {
    title: 'Component',
    subtitle: 'Props',
    definition
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
