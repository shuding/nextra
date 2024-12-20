import type { Root } from 'mdast'
import type { Plugin, Transformer } from 'unified'
import { remove } from 'unist-util-remove'

const transformer: Transformer<Root> = ast => {
  remove(
    ast,
    node =>
      node.type === 'mdxjsEsm' &&
      // @ts-expect-error -- fixme
      node.data.estree.body[0].type === 'ImportDeclaration'
  )
}

export const remarkRemoveImports: Plugin<[], Root> = () => transformer
