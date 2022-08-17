import { Parent } from 'mdast'

export const getFlattenedValue = (node: Parent): string =>
  node.children
    .map(child =>
      'children' in child
        ? getFlattenedValue(child)
        : 'value' in child
        ? child.value
        : ''
    )
    .join('')

export const getASTNodeImport = (name: string, from: string) => ({
  type: 'mdxjsEsm',
  value: `import ${name} from "${from}"`,
  data: {
    estree: {
      type: 'Program',
      body: [
        {
          type: 'ImportDeclaration',
          specifiers: [
            {
              type: 'ImportDefaultSpecifier',
              local: { type: 'Identifier', name }
            }
          ],
          source: {
            type: 'Literal',
            value: from,
            raw: `"${from}"`
          }
        }
      ],
      sourceType: 'module'
    }
  }
})
