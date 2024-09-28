import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { remove } from 'unist-util-remove'

export const remarkRemoveImports: Plugin<[], Root> = () => ast => {
  remove(
    ast,
    node =>
      node.type === 'mdxjsEsm' &&
      // @ts-expect-error
      node.data.estree.body[0].type === 'ImportDeclaration'
  )
}
