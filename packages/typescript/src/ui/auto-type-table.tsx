import { TypeTable } from 'fumadocs-ui/components/type-table';
import { type Jsx, toJsxRuntime } from 'hast-util-to-jsx-runtime';
import * as runtime from 'react/jsx-runtime';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { renderMarkdownToHast } from '@/markdown';
import { type GenerateDocumentationOptions } from '@/lib/base';
import 'server-only';
import { getProject } from '@/get-project';
import type { ReactNode } from 'react';
import {
  type BaseTypeTableProps,
  getTypeTableOutput,
} from '@/utils/type-table';

export interface AutoTypeTableProps extends BaseTypeTableProps {
  /**
   * Override the function to render markdown into JSX nodes
   */
  renderMarkdown?: typeof renderMarkdownDefault;
}

export function createTypeTable(options: GenerateDocumentationOptions = {}): {
  AutoTypeTable: (props: Omit<AutoTypeTableProps, 'options'>) => ReactNode;
} {
  const overrideOptions = {
    ...options,
    project: options.project ?? getProject(options.config),
  };

  return {
    AutoTypeTable(props) {
      return <AutoTypeTable {...props} options={overrideOptions} />;
    },
  };
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
  const output = await getTypeTableOutput(props);

  return output.map(async (item) => {
    const entries = item.entries.map(
      async (entry) =>
        [
          entry.name,
          {
            type: entry.type,
            description: await renderMarkdown(entry.description),
            default: entry.tags.default || entry.tags.defaultValue,
            required: entry.required,
          },
        ] as const,
    );

    return (
      <TypeTable
        key={item.name}
        type={Object.fromEntries(await Promise.all(entries))}
      />
    );
  });
}

async function renderMarkdownDefault(md: string): Promise<ReactNode> {
  return toJsxRuntime(await renderMarkdownToHast(md), {
    Fragment: runtime.Fragment,
    jsx: runtime.jsx as Jsx,
    jsxs: runtime.jsxs as Jsx,
    components: { ...defaultMdxComponents, img: undefined },
  });
}
