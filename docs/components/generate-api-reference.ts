// @ts-expect-error -- fixme
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import { compileMdx } from 'nextra/compile'
import { Callout } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import { generateDefinition } from 'nextra/tsdoc'

const { wrapper: Wrapper, ...components } = getMDXComponents({
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
  { title, subtitle }: { title: string; subtitle: string }
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
    `# \`${apiRef.name}\` ${title}`,
    // Page description
    description,
    'packageName' in apiRef && `Exported from \`${apiRef.packageName}\`.`,
    // Signature
    `## ${subtitle}`,
    '<APIDocs definition={definition} />',
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
    definition: { tags, ...rest }
  })
}
