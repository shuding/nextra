import type { Root } from 'mdast';
import type { Transformer } from 'unified';
import type { ExpressionStatement, ObjectExpression, Property } from 'estree';
import type { Expression, Program } from 'estree';
import type { DocEntry } from '@/lib/base';
import { renderMarkdownToHast } from '@/markdown';
import { valueToEstree } from 'estree-util-value-to-estree';
import { visit } from 'unist-util-visit';
import {
  type BaseTypeTableProps,
  getTypeTableOutput,
} from '@/utils/type-table';
import { getProject } from '@/get-project';
import { toEstree } from 'hast-util-to-estree';
import { dirname } from 'node:path';

function expressionToAttribute(key: string, value: Expression) {
  return {
    type: 'mdxJsxAttribute',
    name: key,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: value,
            },
          ],
        } as Program,
      },
    },
  };
}

async function mapProperty(
  entry: DocEntry,
  renderMarkdown: typeof renderMarkdownToHast,
): Promise<Property> {
  const value = valueToEstree({
    type: entry.type,
    default: entry.tags.default || entry.tags.defaultValue,
  }) as ObjectExpression;

  if (entry.description) {
    const hast = toEstree(await renderMarkdown(entry.description), {
      elementAttributeNameCase: 'react',
    }).body[0] as ExpressionStatement;

    value.properties.push({
      type: 'Property',
      method: false,
      shorthand: false,
      computed: false,
      key: {
        type: 'Identifier',
        name: 'description',
      },
      kind: 'init',
      value: hast.expression,
    });
  }

  return {
    type: 'Property',
    method: false,
    shorthand: false,
    computed: false,
    key: {
      type: 'Identifier',
      name: entry.name,
    },
    kind: 'init',
    value,
  };
}

export interface RemarkAutoTypeTableOptions {
  /**
   * @defaultValue 'auto-type-table'
   */
  name?: string;

  /**
   * @defaultValue 'TypeTable'
   */
  outputName?: string;

  renderMarkdown?: typeof renderMarkdownToHast;

  /**
   * Override some type table props
   */
  options?: BaseTypeTableProps['options'];
}

/**
 * Compile `auto-type-table` into Fumadocs UI compatible TypeTable
 *
 * MDX is required to use this plugin.
 */
export function remarkAutoTypeTable({
  name = 'auto-type-table',
  outputName = 'TypeTable',
  renderMarkdown = renderMarkdownToHast,
  options = {},
}: RemarkAutoTypeTableOptions = {}): Transformer<Root, Root> {
  const project = options.project ?? getProject(options.config);

  return async (tree, file) => {
    const queue: Promise<void>[] = [];
    let basePath = options?.basePath;
    if (!basePath && file.path) basePath = dirname(file.path);

    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (node.name !== name) return;
      const props: Record<string, string> = {};

      for (const attr of node.attributes) {
        if (attr.type !== 'mdxJsxAttribute' || typeof attr.value !== 'string')
          throw new Error(
            '`auto-type-table` does not support non-string attributes',
          );

        props[attr.name] = attr.value;
      }

      async function run() {
        const output = await getTypeTableOutput({
          ...props,
          options: {
            ...options,
            project,
            basePath,
          },
        } as BaseTypeTableProps);

        const rendered = output.map(async (doc) => {
          const properties = await Promise.all(
            doc.entries.map((entry) => mapProperty(entry, renderMarkdown)),
          );

          return {
            type: 'mdxJsxFlowElement',
            name: outputName,
            attributes: [
              expressionToAttribute('type', {
                type: 'ObjectExpression',
                properties,
              }),
            ],
            data: {
              // for Fumadocs `remarkStructure`
              _string: [
                doc.name,
                doc.description,
                ...doc.entries.flatMap((entry) => [
                  `${entry.name}: ${entry.type}`,
                  entry.description,
                ]),
              ],
            },
            children: [],
          };
        });

        Object.assign(node, {
          type: 'root',
          attributes: [],
          children: await Promise.all(rendered),
        } as Root);
      }

      queue.push(run());
      return 'skip';
    });

    await Promise.all(queue);
  };
}
