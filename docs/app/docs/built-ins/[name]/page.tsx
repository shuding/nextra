import { generateApiReference } from '@components/generate-api-reference'
import type { ApiReference } from '@components/generate-api-reference'
// @ts-expect-error -- fixme
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import type { MdxFile } from 'nextra'
import { generateDefinition } from 'nextra/tsdoc'
import type { FC } from 'react'

const API_REFERENCE: (
  | (ApiReference & { groupKeys?: string })
  | { type: 'separator'; title: string; name: string }
)[] = [
  { type: 'separator', title: 'Layout Components', name: '_' },
  { name: 'Search', packageName: 'nextra/components', isFlattened: false },
  {
    name: 'Steps',
    packageName: 'nextra/components',
    groupKeys: "ComponentProps<'div'>"
  }
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
  if ('code' in apiRef) {
    throw new Error('Should not have `code` prop.')
  }
  const { name, packageName, groupKeys, isFlattened } = apiRef
  const code = `
import type { ComponentProps } from 'react'
import { ${name} as MyComponent } from '${packageName}'

type MyProps = ComponentProps<typeof MyComponent>
type $ = ${
    groupKeys
      ? `Omit<MyProps, keyof ${groupKeys}> & { '...props': ${groupKeys} }>`
      : 'MyProps'
  }

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
    title: 'component',
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
