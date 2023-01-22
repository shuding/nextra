import { remove } from 'unist-util-remove'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'

export const remarkRemoveImports: Plugin<[], Root> = () => {
  return (tree, _file, done) => {
    remove(tree, 'mdxjsEsm')
    done()
  }
}
