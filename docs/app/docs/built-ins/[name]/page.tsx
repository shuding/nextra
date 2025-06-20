import path from 'node:path'
import { generateApiReference } from '@components/generate-api-reference'
import type { ApiReference } from '@components/generate-api-reference'
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import type { MdxFile } from 'nextra'
import { generateDefinition } from 'nextra/tsdoc'
import type { FC } from 'react'

type ComponentApiReference = ApiReference & { groupKeys?: string }

const API_REFERENCE: (
  | ComponentApiReference
  | { type: 'separator'; title: string; name: string }
)[] = [
  { type: 'separator', title: 'Layout Components', name: '_' },
  {
    name: 'Banner',
    packageName: 'nextra/components',
    groupKeys: 'HTMLAttributes<HTMLDivElement>'
  },
  {
    name: 'Head',
    packageName: 'nextra/components',
    isFlattened: true
  },
  {
    name: 'Search',
    packageName: 'nextra/components',
    isFlattened: false,
    groupKeys:
      "Omit<ComboboxInputProps, 'className' | 'onChange' | 'onFocus' | 'onBlur' | 'value' | 'placeholder'>"
  },
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
    // TODO: add
    // <APIDocs componentName="Cards.Card" />
    name: 'Cards',
    packageName: 'nextra/components',
    groupKeys: 'HTMLAttributes<HTMLDivElement>'
  },
  {
    // TODO: add
    // <APIDocs componentName="FileTree.Folder" />
    // <APIDocs componentName="FileTree.File" />
    name: 'FileTree',
    packageName: 'nextra/components',
    groupKeys: 'HTMLAttributes<HTMLUListElement>'
  },
  {
    name: 'Steps',
    packageName: 'nextra/components',
    groupKeys: 'HTMLAttributes<HTMLDivElement>'
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
  { name: 'Tabs', packageName: 'nextra/components' },
  { type: 'separator', title: 'Other Components', name: '_3' },
  { name: 'MDXRemote', packageName: 'nextra/mdx-remote' },
  { name: 'Playground', packageName: 'nextra/components' },
  { name: 'TSDoc', packageName: 'nextra/tsdoc' }
]

const routes = API_REFERENCE.filter(
  (o): o is ComponentApiReference => !('type' in o)
)

export const generateStaticParams = () =>
  routes.map(o => ({ name: o.name.toLowerCase() }))

// @ts-expect-error -- fixme
export const pageMap: (MdxFile & { title: string })[] = API_REFERENCE.map(o =>
  'type' in o
    ? o
    : {
        name: o.name.toLowerCase(),
        route: `/docs/built-ins/${o.name.toLowerCase()}`,
        title:
          o.name === 'TSDoc' ? (
            <span className="badge-new">{o.name}</span>
          ) : (
            o.name
          )
      }
)

const Wrapper = getMDXComponents().wrapper

async function getReference(props: PageProps) {
  const params = await props.params
  const apiRefIndex = routes.findIndex(
    o => o.name.toLowerCase() === params.name
  )
  const apiRef = routes[apiRefIndex]
  if (!apiRef) {
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
import type { ComboboxInputProps } from '../packages/nextra/node_modules/@headlessui/react'
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
  const res = await generateApiReference(apiRef, {
    title: 'Component',
    subtitle: 'Props',
    definition
    //     bottomMdxContent: `<Callout type="default">
    // **Tip for TypeScript users:**<br/>
    // You can retrieve the props type for the \`<${name}>\` component using \`React.ComponentProps<typeof ${name}>\`.
    // </Callout>`
  })
  const filePath =
    fcDefinition.filePath &&
    path
      .relative('..', fcDefinition.filePath)
      .replace(/\.d.ts$/, '.tsx')
      .replace('/dist/', '/src/')
  // Add edit on GitHub link to points on a source file
  res.metadata.filePath = `https://github.com/shuding/nextra/tree/main/${filePath}`

  return res
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
