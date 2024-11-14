import type { ObjectExpression, Program } from 'estree'
import type { Plugin } from 'unified'
import { DEFAULT_PROPERTY_PROPS } from '../constants.js'

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
  (ast: Program, file) => {
    const hasMdxLayout = ast.body.some(
      node =>
        node.type === 'VariableDeclaration' &&
        node.kind === 'const' &&
        node.declarations[0].id.type === 'Identifier' &&
        node.declarations[0].id.name === 'MDXLayout'
    )
    if (!hasMdxLayout) {
      if (isRemoteContent) {
        ast.body = ast.body.filter(
          node =>
            !(
              node.type === 'FunctionDeclaration' &&
              node.id.name === 'MDXContent'
            )
        )
        const returnStatement = ast.body.at(-1) as {
          argument: ObjectExpression
        }
        for (const prop of returnStatement.argument.properties) {
          if (
            prop.type === 'Property' &&
            prop.key.type === 'Identifier' &&
            prop.key.name === 'default' &&
            prop.value.type === 'Identifier' &&
            prop.value.name === 'MDXContent'
          ) {
            prop.value.name = '_createMdxContent'
            break;
          }
        }
      } else {
        ast.body = ast.body.filter(
          node => node.type !== 'ExportDefaultDeclaration'
        )
        if (isPageImport) {
          ast.body.unshift({
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: { type: 'Identifier', name: 'HOC_MDXWrapper' },
                local: { type: 'Identifier', name: 'HOC_MDXWrapper' }
              }
            ],
            source: { type: 'Literal', value: 'nextra/setup-page' }
          })
          ast.body.push({
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'CallExpression',
              callee: { type: 'Identifier', name: 'HOC_MDXWrapper' },
              optional: false,
              arguments: [
                { type: 'Identifier', name: '_createMdxContent' },
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
          })
        } else {
          ast.body.push({
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'Identifier',
              name: '_createMdxContent'
            }
          })
        }
      }
    }

    console.dir({ hasMdxLayout, isRemoteContent, isPageImport }, { depth: 4 })
    // const mdxContentIndex = ast.body.findIndex(node => {
    //   if (node.type === 'ExportDefaultDeclaration') {
    //     return (node.declaration as any).id.name === 'MDXContent'
    //   }
    //   if (node.type === 'FunctionDeclaration') {
    //     return node.id.name === 'MDXContent'
    //   }
    // })
    //
    // // Remove `MDXContent` since we use custom HOC_MDXContent
    // let [mdxContent] = ast.body.splice(mdxContentIndex, 1) as any
    //
    // // In MDX3 MDXContent is directly exported as export default when `outputFormat: 'program'` is specified
    // if (mdxContent.type === 'ExportDefaultDeclaration') {
    //   mdxContent = mdxContent.declaration
    // }
    //
    // const mdxContentArgument = mdxContent.body.body[0].argument
    //
    // file.data.hasMdxLayout =
    //   !!mdxContentArgument &&
    //   mdxContentArgument.openingElement.name.name === 'MDXLayout'
  }
