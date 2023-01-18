import { remove } from 'unist-util-remove'
import { Plugin } from 'unified'
import { Root } from 'mdast'

export const remarkRemoveImports: Plugin<[], Root> = () => {
  return (tree, _file, done) => {
    remove(tree, 'mdxjsEsm')
    done()
  }
}
