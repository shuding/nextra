import type {
  ExportDefaultDeclaration,
  ImportDeclaration,
  ObjectExpression,
  Program
} from 'estree'
import type { Plugin } from 'unified'
import { DEFAULT_PROPERTY_PROPS } from '../constants.js'

type Body = Program['body'][number]

function isMdxLayout(node: Body) {
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
    if (hasMdxLayout) {
      if (!isRemoteContent) {
        const defaultExport = ast.body.find(
          (node: Body) => node.type === 'ExportDefaultDeclaration'
        )!
        Object.assign(defaultExport, defaultExport.declaration)
        ast.body.push(createHocCallAst('MDXContent'))
        ast.body.unshift(createHocImportAst())
      }
      return
    }

    const excludeMdxContent = isRemoteContent
      ? (node: Body) =>
          node.type !== 'FunctionDeclaration' || node.id.name !== 'MDXContent'
      : (node: Body) => node.type !== 'ExportDefaultDeclaration'
    ast.body = ast.body.filter(excludeMdxContent)

    // Remote MDX
    if (isRemoteContent) {
      const returnStatement = ast.body.at(-1) as {
        argument: ObjectExpression
      }
      for (const node of returnStatement.argument.properties) {
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
      ast.body.push(createHocCallAst('_createMdxContent'))
      return
    }
    // Partial MDX
    ast.body.push({
      type: 'ExportDefaultDeclaration',
      declaration: {
        type: 'Identifier',
        name: '_createMdxContent'
      }
    })
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

function createHocCallAst(componentName: string): ExportDefaultDeclaration {
  return {
    type: 'ExportDefaultDeclaration',
    declaration: {
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
}
