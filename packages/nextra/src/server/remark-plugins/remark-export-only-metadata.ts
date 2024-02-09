import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { remove } from 'unist-util-remove'

export const remarkExportOnlyMetadata: Plugin<[], Root> = () => ast => {
  remove(ast, node => {
    const isMdxJs = node.type === 'mdxjsEsm'

    if (!isMdxJs) return true

    // @ts-expect-error
    const [body] = node.data.estree.body
    const isExportNamed = body.type === 'ExportNamedDeclaration'

    if (!isExportNamed) return true

    const isVariableDeclaration =
      body.declaration && body.declaration.type === 'VariableDeclaration'
    if (!isVariableDeclaration) return true

    const isMetadata = body.declaration.declarations[0].id.name === 'metadata'
    return !isMetadata
  })
}
