import type { Root } from 'mdast'
import { highlightersFromSettings, remarkVisitor } from 'remark-shiki-twoslash'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const remarkShikiTwoSlash: Plugin<[], Root> = () => async (ast: any) => {
  const settings = {
    themes: ['github-light', 'github-dark']
  }
  const highlighters = await highlightersFromSettings(settings)

  visit(ast, 'code', remarkVisitor(highlighters, settings))
}
