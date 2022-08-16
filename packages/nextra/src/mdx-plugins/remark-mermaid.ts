import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import { getASTNodeImport } from './utils'

const getMermaidElementAST = (value: string) => ({
  type: 'mdxJsxFlowElement',
  name: 'Mermaid',
  children: [],
  attributes: [
    {
      type: 'mdxJsxAttribute',
      name: 'chart',
      value: {
        type: 'mdxJsxAttributeValueExpression',
        value: `\`${value}\``,
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        raw: value,
                        cooked: value,
                      },
                      tail: true,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  ],
});

export const remarkMermaid: Plugin<[], Root> = () => (ast, file, done) => {
  const codeblocks: any[][] = [];
  visit(ast, { type: 'code', lang: 'mermaid' }, (node, index, parent) => {
    codeblocks.push([node, index, parent]);
  });

  if (codeblocks.length !== 0) {
    for (const [node, index, parent] of codeblocks) {
      parent.children.splice(index, 1, getMermaidElementAST(node.value));
    }
    ast.children.unshift(getASTNodeImport('Mermaid', 'nextra/mermaid', true) as any);
  }

  done();
};
