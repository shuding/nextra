import Slugger from 'github-slugger'
import type { Parent, Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Heading } from '../../types'
import { MARKDOWN_EXTENSION_REGEX } from '../constants.js'
import type { HProperties } from './remark-custom-heading-id'

export const getFlattenedValue = (node: Parent): string =>
  node.children
    .map(child =>
      'children' in child
        ? getFlattenedValue(child)
        : 'value' in child
        ? child.value
        : ''
    )
    .join('')

const SKIP_FOR_PARENT_NAMES = new Set(['Tab', 'Tabs.Tab'])

export const remarkHeadings: Plugin<
  [{ exportName?: string; isRemoteContent?: boolean }],
  Root
> = ({ exportName = 'useTOC', isRemoteContent }) => {
  const headings: (Heading | string)[] = []
  let hasJsxInH1: boolean

  const slugger = new Slugger()
  return (ast, file) => {
    const PartialComponentToHeadingsName: Record<string, string> =
      Object.create(null)

    visit(
      ast,
      [
        'heading',
        // push partial component's `useTOC` export name to headings list
        'mdxJsxFlowElement',
        // verify .md/.mdx exports and attach named `useTOC` export
        'mdxjsEsm'
      ],
      (node, _index, parent) => {
        if (node.type === 'heading') {
          if (node.depth === 1) {
            const hasJsx = node.children.some(
              (child: { type: string }) => child.type === 'mdxJsxTextElement'
            )
            if (hasJsx) {
              hasJsxInH1 = true
            }
            return
          }

          node.data ||= {}
          const headingProps: HProperties = (node.data.hProperties ||= {})
          if (SKIP_FOR_PARENT_NAMES.has((parent as any).name)) {
            delete headingProps.id
          } else {
            const value = getFlattenedValue(node)
            const id = slugger.slug(headingProps.id || value)
            // Attach flattened/custom #id to heading node
            headingProps.id = id
            headings.push({ depth: node.depth, value, id })
          }
          return
        }

        if (isRemoteContent) {
          // skip
        } else if ((node as any).type === 'mdxjsEsm') {
          for (const child of (node as any).data.estree.body) {
            if (child.type !== 'ImportDeclaration') continue
            const importPath = child.source.value
            const isMdxImport = MARKDOWN_EXTENSION_REGEX.test(importPath)
            if (!isMdxImport) continue

            const componentName = child.specifiers.find(
              (o: any) => o.type === 'ImportDefaultSpecifier'
            )?.local.name

            if (!componentName) continue
            const { length } = Object.keys(PartialComponentToHeadingsName)
            const exportAsName = `${exportName}${length}`
            PartialComponentToHeadingsName[componentName] = exportAsName

            child.specifiers.push({
              type: 'ImportSpecifier',
              imported: { type: 'Identifier', name: exportName },
              local: { type: 'Identifier', name: exportAsName }
            })
          }
        } else {
          // If component name equals default export name from .md/.mdx import
          const headingsName =
            PartialComponentToHeadingsName[(node as any).name]
          if (headingsName) {
            headings.push(headingsName)
          }
        }
      }
    )

    file.data.hasJsxInH1 = hasJsxInH1
    file.data.toc = headings
  }
}
