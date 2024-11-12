import type { Program } from 'estree'
import type { Plugin } from 'unified'

export const recmaRewrite: Plugin<[], Program> = () => (ast, file) => {
  const mdxContentIndex = ast.body.findIndex(node => {
    if (node.type === 'ExportDefaultDeclaration') {
      return (node.declaration as any).id.name === 'MDXContent'
    }
    if (node.type === 'FunctionDeclaration') {
      return node.id.name === 'MDXContent'
    }
  })

  // Remove `MDXContent` since we use custom HOC_MDXContent
  let [mdxContent] = ast.body.splice(mdxContentIndex, 1) as any

  // In MDX3 MDXContent is directly exported as export default when `outputFormat: 'program'` is specified
  if (mdxContent.type === 'ExportDefaultDeclaration') {
    mdxContent = mdxContent.declaration
  }

  const mdxContentArgument = mdxContent.body.body[0].argument

  file.data.hasMdxLayout =
    !!mdxContentArgument &&
    mdxContentArgument.openingElement.name.name === 'MDXLayout'
}
