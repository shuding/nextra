// @ts-expect-error -- fixme
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import { compileMdx } from 'nextra/compile'
import { Bleed, Callout, Steps } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import { generateDefinition } from 'nextra/tsdoc'
// @ts-expect-error -- fixme
import ExampleTSDoc from './example-tsdoc.mdx'
import { PlaygroundDemo } from './playground-demo'

const { wrapper: Wrapper, ...components } = getMDXComponents({
  Callout,
  Steps,
  Bleed,
  PlaygroundDemo,
  ExampleTSDoc
})

export type ApiReference = {
  name: string
  isFlattened?: boolean
} & ({ code: string } | { packageName: string })

export async function generateApiReference(
  apiRef: ApiReference,
  {
    title,
    subtitle,
    definition: {
      description,
      // @ts-expect-error -- fixme
      tags = {},
      ...rest
    }
  }: {
    title: string
    subtitle: string
    definition: ReturnType<typeof generateDefinition>
  }
) {
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

${tags.example}`,
    // Usage
    tags.usage &&
      `## Usage

${tags.usage}`
  ].filter(Boolean)

  const rawJs = await compileMdx(result.join('\n\n'))
  return evaluate(rawJs, components, {
    definition: { tags, ...rest }
  })
}
