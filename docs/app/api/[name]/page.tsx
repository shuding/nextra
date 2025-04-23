import { generateApiReference } from '@components/generate-api-reference'
import type { ApiReference } from '@components/generate-api-reference'
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import type { MdxFile } from 'nextra'
import { generateDefinition } from 'nextra/tsdoc'
import type { FC } from 'react'

type CurrentReference = ApiReference & { filePath: string }

const API_REFERENCE: (
  | CurrentReference
  | { type: 'separator'; title: string; name: string }
)[] = [
  { type: 'separator', title: 'Types', name: '_' },
  {
    name: 'NextraConfig',
    packageName: 'nextra',
    isFlattened: false,
    filePath: 'server/schemas.ts'
  },
  {
    name: 'MdxOptions',
    code: `import type { NextraConfig } from 'nextra'
type $ = NonNullable<NextraConfig['mdxOptions']>
export default $`,
    isFlattened: false,
    filePath: 'server/schemas.ts'
  },
  { type: 'separator', title: 'Functions', name: '_2' },
  {
    name: 'nextra',
    code: "export { default } from 'nextra'",
    isFlattened: false,
    filePath: 'server/index.ts'
  },
  {
    name: 'useMDXComponents',
    packageName: 'nextra/mdx-components',
    isFlattened: false,
    filePath: 'client/mdx-components.ts'
  },
  {
    name: 'getPageMap',
    packageName: 'nextra/page-map',
    filePath: 'server/page-map/get.ts'
  },
  {
    name: 'generateStaticParamsFor',
    packageName: 'nextra/pages',
    filePath: 'client/pages.ts'
  },
  {
    name: 'importPage',
    packageName: 'nextra/pages',
    filePath: 'client/pages.ts'
  },
  {
    name: 'compileMdx',
    packageName: 'nextra/compile',
    filePath: 'server/compile.ts'
  },
  {
    name: 'generateDefinition',
    packageName: 'nextra/tsdoc',
    filePath: 'server/tsdoc/base.ts'
  },
  {
    name: 'middleware',
    packageName: 'nextra/locales',
    filePath: 'server/locales.ts'
  },
  {
    name: 'evaluate',
    packageName: 'nextra/evaluate',
    filePath: 'client/evaluate.ts'
  },
  {
    name: 'normalizePages',
    packageName: 'nextra/normalize-pages',
    filePath: 'client/normalize-pages.ts'
  }
]

const routes = API_REFERENCE.filter(
  (o): o is CurrentReference => !('type' in o)
)

const separatorIndex = API_REFERENCE.findIndex(
  o => 'title' in o && o.title === 'Functions'
)
const functionsIndex = routes.indexOf(
  API_REFERENCE[separatorIndex + 1] as CurrentReference
)

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
  const isType = functionsIndex > apiRefIndex

  const definition = generateDefinition({
    code:
      apiRef.code ??
      `export { ${apiRef.name} as default } from '${apiRef.packageName}'`,
    flattened: apiRef.isFlattened !== false
  })

  const result = await generateApiReference(apiRef, {
    title: isType ? 'Type' : 'Function',
    subtitle: isType ? 'Fields' : 'Signature',
    definition
  })
  // Add edit on GitHub link to points on a source file
  result.metadata.filePath = `https://github.com/shuding/nextra/tree/main/packages/nextra/src/${apiRef.filePath}`

  return result
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
