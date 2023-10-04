import type { Program } from 'estree'
import type { Plugin } from 'unified'

export const recmaRewriteFunctionBody: Plugin<[], Program> =
  () => (ast: Program) => {
    // Rename `default: MDXContent` to `default: _createMdxContent`
    const topLevelReturn = ast.body.find(
      node => node.type === 'ReturnStatement'
    )
    // @ts-expect-error
    const mdxContentProp = topLevelReturn.argument.properties.find(
      // @ts-expect-error
      prop => prop.value.name === 'MDXContent'
    )
    mdxContentProp.value.name = '_createMdxContent'
  }
