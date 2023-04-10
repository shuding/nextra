import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import { EXTERNAL_URL_REGEX } from '../constants'

export type RemarkLinkRewriteOptions = {
  pattern: RegExp
  replace: string
  excludeExternalLinks?: boolean
}

export const remarkLinkRewrite: Plugin<[RemarkLinkRewriteOptions], Root> = ({
  pattern,
  replace,
  excludeExternalLinks
}) => {
  return (tree, _file, done) => {
    visit(tree, 'link', node => {
      if (!(excludeExternalLinks && EXTERNAL_URL_REGEX.test(node.url))) {
        node.url = node.url.replace(pattern, replace)
      }
    })
    done()
  }
}
