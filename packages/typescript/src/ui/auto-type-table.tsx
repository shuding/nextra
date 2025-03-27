import { compileMdx } from 'nextra/compile'
import { MDXRemote } from 'nextra/mdx-remote'
import type { ComponentProps, ReactNode } from 'react'
import { getProject } from '../get-project.js'
import type { GenerateDocumentationOptions } from '../lib/base.js'
import type { BaseTypeTableProps } from '../utils/type-table.js'
import { getTypeTableOutput } from '../utils/type-table.js'
import { PropsTable } from './props-table.js'

interface AutoTypeTableProps extends BaseTypeTableProps {
  /**
   * Override the function to render markdown into JSX nodes
   */
  renderMarkdown?: typeof renderMarkdownDefault
  typeLinkMap?: ComponentProps<typeof PropsTable>['typeLinkMap']
}

export function createTypeTable(options: GenerateDocumentationOptions = {}): {
  AutoTypeTable: (props: Omit<AutoTypeTableProps, 'options'>) => ReactNode
} {
  const overrideOptions = {
    ...options,
    project: options.project ?? getProject(options.config)
  }

  return {
    AutoTypeTable(props) {
      return <AutoTypeTable {...props} options={overrideOptions} />
    }
  }
}

/**
 * **Server Component Only**
 *
 * Display properties in an exported interface via Type Table
 */
async function AutoTypeTable({
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
            description: await renderMarkdown(entry.description),
            default: entry.tags.default || entry.tags.defaultValue,
            required: entry.required
          }
        ] as const
    )

    const type = Object.fromEntries(await Promise.all(entries))

    return (
      <PropsTable
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
