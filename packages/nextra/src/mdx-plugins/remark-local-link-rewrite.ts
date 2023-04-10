import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import { EXTERNAL_URL_REGEX } from '../constants'

export type RemarkLocalLinkRewriteOptions = {
  pattern: RegExp
  replace: string
}

export const remarkLocalLinkRewrite: Plugin<
  [RemarkLocalLinkRewriteOptions],
  Root
> = ({ pattern, replace }) => {
  return (tree, _file, done) => {
    visit(tree, 'link', node => {
      if (!EXTERNAL_URL_REGEX.test(node.url)) {
        node.url = node.url.replace(pattern, replace)
      }
    })
    done()
  }
}
