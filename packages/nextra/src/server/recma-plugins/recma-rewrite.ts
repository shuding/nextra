import type {
  CallExpression,
  ImportDeclaration,
  ObjectExpression,
  Program
} from 'estree'
import type { Plugin } from 'unified'
import { DEFAULT_PROPERTY_PROPS } from '../constants.js'

enum Mdx {
  Wrapper = 'MDXContent',
  Content = '_createMdxContent'
}

export const recmaRewrite: Plugin<
  [{ isPageImport?: boolean; isRemoteContent?: boolean }],
  Program
> =
  ({ isPageImport, isRemoteContent }) =>
  (ast: Program) => {
    const hasMdxLayout = ast.body.some(
      node =>
        node.type === 'VariableDeclaration' &&
        node.kind === 'const' &&
        node.declarations[0]!.id.type === 'Identifier' &&
        node.declarations[0]!.id.name === 'MDXLayout'
    )
    // Remote MDX
    if (isRemoteContent) {
      if (hasMdxLayout) {
        return
      }
      // Remove `function MDXContent` with wrapper logic
      ast.body = ast.body.filter(
        node =>
          node.type !== 'FunctionDeclaration' || node.id.name !== Mdx.Wrapper
      )
      const returnStatement = ast.body.find(
        node => node.type === 'ReturnStatement'
      )!
      const { properties } = returnStatement.argument as ObjectExpression
      for (const node of properties) {
        if (
          node.type === 'Property' &&
          node.key.type === 'Identifier' &&
          node.key.name === 'default' &&
          node.value.type === 'Identifier' &&
          node.value.name === Mdx.Wrapper
        ) {
          node.value.name = Mdx.Content
          break
        }
      }
      return
    }
    const defaultExport = ast.body.find(
      node => node.type === 'ExportDefaultDeclaration'
    )!

    if (hasMdxLayout) {
      // `export default function MDXContent` > `function MDXContent`
      Object.assign(defaultExport, defaultExport.declaration)
      ast.body.unshift(HOC_IMPORT_AST)
      ast.body.push({
        type: 'ExportDefaultDeclaration',
        declaration: createHocCallAst(Mdx.Wrapper)
      })
      return
    }

    // Page MDX
    if (isPageImport) {
      ast.body.unshift(HOC_IMPORT_AST)
      defaultExport.declaration = createHocCallAst(Mdx.Content)
      return
    }
    // Partial MDX
    defaultExport.declaration = {
      type: 'Identifier',
      name: Mdx.Content
    }
  }

const HOC_IMPORT_AST: ImportDeclaration = {
  type: 'ImportDeclaration',
  source: { type: 'Literal', value: 'nextra/setup-page' },
  specifiers: [
    {
      type: 'ImportSpecifier',
      imported: { type: 'Identifier', name: 'HOC_MDXWrapper' },
      local: { type: 'Identifier', name: 'HOC_MDXWrapper' }
    }
  ]
}

function createHocCallAst(componentName: string): CallExpression {
  return {
    type: 'CallExpression',
    callee: { type: 'Identifier', name: 'HOC_MDXWrapper' },
    optional: false,
    arguments: [
      { type: 'Identifier', name: componentName },
      {
        type: 'ObjectExpression',
        properties: [
          {
            ...DEFAULT_PROPERTY_PROPS,
            shorthand: true,
            key: { type: 'Identifier', name: 'metadata' },
            value: { type: 'Identifier', name: 'metadata' }
          },
          {
            ...DEFAULT_PROPERTY_PROPS,
            shorthand: true,
            key: { type: 'Identifier', name: 'toc' },
            value: { type: 'Identifier', name: 'toc' }
          }
        ]
      }
    ]
  }
}
