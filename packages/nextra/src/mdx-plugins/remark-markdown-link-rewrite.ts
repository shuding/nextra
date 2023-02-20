import type { Root } from 'mdast'
import type { PluginTuple } from 'unified'
import { MARKDOWN_EXTENSION_REGEX } from '../constants'
import type { RemarkLinkRewriteOptions } from './remark-link-rewrite'
import { remarkLinkRewrite } from './remark-link-rewrite'

const options: RemarkLinkRewriteOptions = {
  pattern: MARKDOWN_EXTENSION_REGEX,
  replace: ''
}

// A Remark plugin to remove the markdown file extension from links
export const remarkMarkdownLinkRewrite: PluginTuple<
  [RemarkLinkRewriteOptions],
  Root,
  Root
> = [remarkLinkRewrite, options]
