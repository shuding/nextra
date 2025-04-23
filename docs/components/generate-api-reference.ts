import { BoxIcon, CardsIcon, OneIcon, WarningIcon } from '@components/icons'
import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import { compileMdx } from 'nextra/compile'
import {
  Bleed,
  Callout,
  Cards,
  FileTree,
  Steps,
  Table,
  Tabs
} from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import type { generateDefinition } from 'nextra/tsdoc'
import { BackgroundColor, Slider } from './_slider'
import ExampleTSDoc from './example-tsdoc.mdx'
import { PlaygroundDemo } from './playground-demo'

const { wrapper: _Wrapper, ...components } = getMDXComponents({
  Callout,
  Steps,
  Bleed,
  PlaygroundDemo,
  ExampleTSDoc,
  Tabs,
  FileTree,
  Table,
  Cards,
  BoxIcon,
  CardsIcon,
  OneIcon,
  WarningIcon,
  BackgroundColor,
  Slider
})

export interface ApiReference {
  name: string
  isFlattened?: boolean
  code?: string
  packageName?: string
}

interface Options {
  title: string
  subtitle: string
  definition: ReturnType<typeof generateDefinition>
  bottomMdxContent?: string
}

export async function generateApiReference(
  apiRef: ApiReference,
  { title, subtitle, definition, bottomMdxContent }: Options
) {
  const { description, tags = {} } = definition
  const result = [
    description &&
      // og:description
      `export const metadata = { description: ${JSON.stringify(description.split('\n', 1)[0])} }`,
    // Title
    `# \`${apiRef.name}\` ${title}`,
    // Page description
    description,
    apiRef.packageName && `Exported from \`${apiRef.packageName}\`.`,
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

${tags.usage}`,
    bottomMdxContent
  ].filter(Boolean)

  const rawJs = await compileMdx(result.join('\n\n'))
  return evaluate(rawJs, components, { definition })
}
