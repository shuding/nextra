import { getEnhancedPageMap } from '@components/get-page-map'
// @ts-expect-error -- fixme
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import { Folder } from 'nextra'
import { compileMdx } from 'nextra/compile'
import { Callout } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import { generateDefinition, TSDoc } from 'nextra/tsdoc'

const { wrapper: Wrapper, ...components } = getMDXComponents({
  TSDoc,
  Callout
})

export type ApiReference = {
  name: string
  isFlattened?: boolean
} & (
  | {
      code: string
    }
  | {
      packageName: string
    }
)

export async function generateApiReference(
  apiRef: ApiReference,
  { isType }: { isType?: boolean } = {}
) {
  const {
    description,
    // @ts-expect-error -- fixme
    tags = {},
    ...rest
  } = generateDefinition({
    code:
      'code' in apiRef
        ? apiRef.code
        : `export { ${apiRef.name} as default } from '${apiRef.packageName}'`,
    flattened: apiRef.isFlattened !== false
  })
  const result = [
    description &&
      // og:description
      `export const metadata = { description: ${JSON.stringify(description.split('\n', 1)[0])} }`,
    // Title
    `# \`${apiRef.name}\` ${isType ? 'type' : 'function'}`,
    // Page description
    description,
    'packageName' in apiRef && `Exported from \`${apiRef.packageName}\`.`,
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
