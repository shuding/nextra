import type { Root } from 'mdast'
import type { Plugin, Transformer } from 'unified'
import { remove } from 'unist-util-remove'

const transformer: Transformer<Root> = ast => {
  remove(ast, node => {
    const isMdxJs = node.type === 'mdxjsEsm'

    if (!isMdxJs) return true

    // @ts-expect-error -- fixme
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
export const remarkExportOnlyMetadata: Plugin<[], Root> = () => transformer
