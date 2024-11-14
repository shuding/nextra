import type { Program } from 'estree'
import type { Plugin } from 'unified'

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
    if (!hasMdxLayout && !isPageImport) {
      ast.body = ast.body.filter(
        node => node.type !== 'ExportDefaultDeclaration'
      )
      ast.body.push({
        type: 'ExportDefaultDeclaration',
        declaration: {
          type: 'Identifier',
          name: '_createMdxContent'
        }
      })
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
