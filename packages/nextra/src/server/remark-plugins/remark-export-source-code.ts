import type { Root } from 'mdast'
import type { Plugin } from 'unified'

export const remarkExportSourceCode: Plugin<[], Root> = () => ast => {
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
                    value: ''
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
