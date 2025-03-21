import type { Nodes } from 'hast';
import { remark } from 'remark';
import {
  remarkGfm,
  rehypeCode,
  type RehypeCodeOptions,
} from 'fumadocs-core/mdx-plugins';
import remarkRehype from 'remark-rehype';

const processor = remark()
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeCode, {
    lazy: true,

    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  } satisfies RehypeCodeOptions)
  // @ts-expect-error -- safe
  .use(() => {
    return (tree, file: { data: Record<string, unknown> }) => {
      file.data.tree = tree;

      return '';
    };
  });

export async function renderMarkdownToHast(md: string): Promise<Nodes> {
  md = md.replace(/{@link (?<link>[^}]*)}/g, '$1'); // replace jsdoc links

  const out = await processor.process(md);

  return out.data.tree as Nodes;
}
