import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { remove } from 'unist-util-remove'

export const remarkRemoveImports: Plugin<[], Root> = () => ast => {
  remove(ast, 'mdxjsEsm')
}
