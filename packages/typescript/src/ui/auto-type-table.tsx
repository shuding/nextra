import 'server-only'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { useMDXComponents } from 'next-mdx-import-source-file'
import type { ReactNode } from 'react'
import * as runtime from 'react/jsx-runtime'
import { getProject } from '../get-project.js'
import type { GenerateDocumentationOptions } from '../lib/base.js'
import { renderMarkdownToHast } from '../markdown.js'
import type { BaseTypeTableProps } from '../utils/type-table.js'
import { getTypeTableOutput } from '../utils/type-table.js'
import { PropsTable } from './props-table.js'

export interface AutoTypeTableProps extends BaseTypeTableProps {
  /**
   * Override the function to render markdown into JSX nodes
   */
  renderMarkdown?: typeof renderMarkdownDefault
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
export async function AutoTypeTable({
  renderMarkdown = renderMarkdownDefault,
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
      />
    )
  })
}

async function renderMarkdownDefault(md: string): Promise<ReactNode> {
  return toJsxRuntime(await renderMarkdownToHast(md), {
    Fragment: runtime.Fragment,
    jsx: runtime.jsx,
    jsxs: runtime.jsxs,
    // @ts-expect-error -- fixme
    components: useMDXComponents()
  })
}
