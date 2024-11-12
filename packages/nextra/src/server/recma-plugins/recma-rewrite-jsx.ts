import type { FunctionDeclaration, Program } from 'estree'
import type { Plugin } from 'unified'

export const recmaRewriteJsx: Plugin<[], Program> =
  () => (ast: Program, file) => {
    ast.body = ast.body
      // Remove `export default MDXContent;`
      .filter(
        node =>
          node.type !== 'ExportDefaultDeclaration' ||
          // @ts-expect-error fixme
          node.declaration.name !== 'MDXContent'
      )

    const createMdxContentIndex = ast.body.findIndex(
      o => o.type === 'FunctionDeclaration' && o.id.name === '_createMdxContent'
    )

    const createMdxContent = ast.body[
      createMdxContentIndex
    ] as FunctionDeclaration

    if (file.data.hasMdxLayout) {
      ast.body.splice(createMdxContentIndex, 1)
      return
    }

    createMdxContent.id.name = 'MDXLayout'
 }
