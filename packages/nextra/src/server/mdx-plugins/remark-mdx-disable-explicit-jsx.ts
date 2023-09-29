import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const remarkMdxDisableExplicitJsx: Plugin<
  [{ whiteList: string[] }],
  Root
> =
  ({ whiteList }) =>
  ast => {
    const test = whiteList.map(name => ({ name }))
    visit(ast, test, node => {
      // @ts-expect-error -- types are wrong here Property `_mdxExplicitJsx` does not exist on type `RootData`
      delete node.data!._mdxExplicitJsx
    })
  }
