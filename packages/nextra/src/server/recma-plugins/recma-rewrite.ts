import type {
  CallExpression,
  ImportDeclaration,
  ObjectExpression,
  Program
} from 'estree'
import type { Plugin } from 'unified'
import { DEFAULT_PROPERTY_PROPS } from '../constants.js'

type Node = Program['body'][number]

function isMdxLayout(node: Node) {
  return (
    node.type === 'VariableDeclaration' &&
    node.kind === 'const' &&
    node.declarations[0].id.type === 'Identifier' &&
    node.declarations[0].id.name === 'MDXLayout'
  )
}

export const recmaRewrite: Plugin<
  [
    {
      isPageImport?: boolean
      isRemoteContent?: boolean
    }
  ],
  Program
> =
  ({ isPageImport, isRemoteContent }) =>
  ast => {
    const hasMdxLayout = ast.body.some(isMdxLayout)
    const defaultExport = ast.body.find(
      (node: Node) => node.type === 'ExportDefaultDeclaration'
    )!
    if (hasMdxLayout) {
      if (!isRemoteContent) {
        // `export default function MDXContent` > `function MDXContent`
        Object.assign(defaultExport, defaultExport.declaration)
        ast.body.unshift(createHocImportAst())
        ast.body.push({
          type: 'ExportDefaultDeclaration',
          declaration: createHocCallAst('MDXContent')
        })
      }
      return
    }

    // Remote MDX
    if (isRemoteContent) {
      // Remove `function MDXContent` with wrapper logic
      ast.body = ast.body.filter(
        (node: Node) =>
          node.type !== 'FunctionDeclaration' || node.id.name !== 'MDXContent'
      )
      const returnStatement = ast.body.find(
        (node: Node) => node.type === 'ReturnStatement'
      )!
      const { properties } = returnStatement!.argument as ObjectExpression
      for (const node of properties) {
        if (
          node.type === 'Property' &&
          node.key.type === 'Identifier' &&
          node.key.name === 'default' &&
          node.value.type === 'Identifier' &&
          node.value.name === 'MDXContent'
        ) {
          node.value.name = '_createMdxContent'
          break
        }
      }
      return
    }

    // Page MDX
    if (isPageImport) {
      ast.body.unshift(createHocImportAst())
      defaultExport.declaration = createHocCallAst('_createMdxContent')
      return
    }
    // Partial MDX
    defaultExport.declaration = {
      type: 'Identifier',
      name: '_createMdxContent'
    }
  }

function createHocImportAst(): ImportDeclaration {
  return {
    type: 'ImportDeclaration',
    specifiers: [
      {
        type: 'ImportSpecifier',
        imported: { type: 'Identifier', name: 'HOC_MDXWrapper' },
        local: { type: 'Identifier', name: 'HOC_MDXWrapper' }
      }
    ],
    source: { type: 'Literal', value: 'nextra/setup-page' }
  }
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
