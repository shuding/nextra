import type { Root } from 'mdast'
import type { Plugin } from 'unified'

// eslint-disable-next-line unicorn/consistent-function-scoping
export const remarkExportSourceCode: Plugin<[], Root> = () => (ast, file) => {
  ast.children.push({
    type: 'mdxjsEsm',
    value: '',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'sourceCode' },
                  init: {
                    type: 'Literal',
                    value: String(file.value).trim()
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })
}
