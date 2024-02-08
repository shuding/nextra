import type { Element } from 'hast'
import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import { bundledLanguages, getHighlighter } from 'shiki'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

type PreElement = Element & {
  __filename?: string
  __hasCopyCode?: boolean
  __hasWordWrap?: boolean
}

const CODE_BLOCK_FILENAME_REGEX = /filename="([^"]+)"/

export const DEFAULT_REHYPE_PRETTY_CODE_OPTIONS: RehypePrettyCodeOptions = {
  keepBackground: false,
  grid: false,
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children.push({ type: 'text', value: ' ' })
    }
    delete node.properties['data-line']
  },
  theme: {
    light: 'github-light',
    dark: 'github-dark'
  },
  getHighlighter(opts) {
    return getHighlighter({
      ...opts,
      // Without `getHighlighter` option ```mdx lang is not highlighted...
      langs: Object.keys(bundledLanguages)
    })
  },
  filterMetaString: meta => meta.replace(CODE_BLOCK_FILENAME_REGEX, '')
}

export const rehypeParseCodeMeta: Plugin<
  [{ defaultShowCopyCode?: boolean }],
  any
> =
  ({ defaultShowCopyCode }) =>
  ast => {
    visit(ast, { tagName: 'pre' }, (node: PreElement) => {
      const [codeEl] = node.children as Element[]
      // @ts-expect-error fixme
      const { meta = '' } = codeEl.data || {}

      node.__filename = meta.match(CODE_BLOCK_FILENAME_REGEX)?.[1]
      node.properties['data-filename'] = node.__filename

      node.__hasWordWrap = meta.includes('word-wrap=false') ? false : true
      if (node.__hasWordWrap) {
        node.properties['data-word-wrap'] = ''
      }

      node.__hasCopyCode = meta
        ? (defaultShowCopyCode && !/( |^)copy=false($| )/.test(meta)) ||
          /( |^)copy($| )/.test(meta)
        : defaultShowCopyCode
      if (node.__hasCopyCode) {
        node.properties['data-copy'] = ''
      }
    })
  }

export const rehypeAttachCodeMeta: Plugin<[], any> = () => ast => {
  visit(ast, [{ tagName: 'figure' }, { tagName: 'span' }], (node: Element) => {
    const isRehypePrettyCode =
      'data-rehype-pretty-code-figure' in node.properties
    if (!isRehypePrettyCode) return

    // remove <figure data-rehype-pretty-code-figure /> element that wraps <pre /> element
    // because we'll wrap with our own <div />
    const preEl: PreElement = Object.assign(node, node.children[0])
    delete preEl.properties['data-theme']

    if (preEl.tagName === 'pre') {
      const [codeEl] = preEl.children as Element[]
      delete codeEl.properties['data-theme']
      delete codeEl.properties['data-language']

      if (preEl.__hasWordWrap) {
        preEl.properties['data-word-wrap'] = ''
      }

      if (preEl.__filename) {
        preEl.properties['data-filename'] = preEl.__filename
      }
      if (preEl.__hasCopyCode) {
        preEl.properties['data-copy'] = ''
      }
      // @ts-expect-error fixme
      if (preEl.type === 'mdxJsxFlowElement') {
        if (node.properties.className === undefined)
          delete node.properties.className
        if (node.properties.style === undefined) delete node.properties.style
        // @ts-expect-error fixme
        preEl.attributes.push(
          ...Object.entries(node.properties).map(([name, value]) => ({
            type: 'mdxJsxAttribute',
            name,
            value: Array.isArray(value) ? value.join(' ') : value
          }))
        )
      }
    } else {
      // remove class="line"
      // @ts-expect-error fixme
      delete node.children[0].properties.className
    }
  })
}
