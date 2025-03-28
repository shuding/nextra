import { compileMdx } from 'nextra/compile'
import { MDXRemote } from 'nextra/mdx-remote'
import type { ComponentProps, ReactNode } from 'react'
import type { BaseTypeTableProps } from '../base.js'
import { getTypeTableOutput } from '../base.js'
import { TSDoc } from './tsdoc.js'

interface AutoTypeTableProps extends BaseTypeTableProps {
  /**
   * Override the function to render markdown into JSX nodes
   */
  renderMarkdown?: typeof renderMarkdownDefault
  typeLinkMap?: ComponentProps<typeof TSDoc>['typeLinkMap']
}

/**
 * Display properties in an exported interface via Type Table
 */
export async function AutoTypeTable({
  renderMarkdown = renderMarkdownDefault,
  typeLinkMap = {},
  ...props
}: AutoTypeTableProps): Promise<ReactNode> {
  const output = await getTypeTableOutput(props)

  return output.map(async item => {
    const entries = item.entries.map(
      async entry =>
        [
          entry.name,
          {
            type: entry.type,
            description: await renderMarkdown(
              entry.description || entry.tags.description || ''
            ),
            default: entry.tags.default || entry.tags.defaultValue,
            required: entry.required
          }
        ] as const
    )

    const type = Object.fromEntries(await Promise.all(entries))

    return (
      <TSDoc
        key={item.name}
        // @ts-expect-error -- fixme
        type={type}
        typeLinkMap={typeLinkMap}
      />
    )
  })
}

async function renderMarkdownDefault(md: string): Promise<ReactNode> {
  if (!md) return
  const rawJs = await compileMdx(md)
  return <MDXRemote compiledSource={rawJs} />
}
