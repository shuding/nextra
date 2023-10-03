import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import { remove } from 'unist-util-remove'

export const remarkMdxTitle: Plugin<[], Root> = () => ast => {
  console.log(ast.body)
}
