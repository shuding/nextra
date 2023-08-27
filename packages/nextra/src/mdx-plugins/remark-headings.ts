import Slugger from 'github-slugger'
import type { Parent, Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { MARKDOWN_EXTENSION_REGEX } from '../constants'
import type { Heading } from '../types'
import type { HProperties } from './remark-custom-heading-id'

const getFlattenedValue = (node: Parent): string =>
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
> = ({ exportName = '__toc', isRemoteContent }) => {
  const headings: (Heading | string)[] = []
  let hasJsxInH1: boolean
  let title: string

  const slugger = new Slugger()
  return (tree, file, done) => {
    const PartialComponentToHeadingsName: Record<string, string> =
      Object.create(null)

    visit(
      tree,
      [
        'heading',
        // push partial component's __toc export name to headings list
        'mdxJsxFlowElement',
        // verify .md/.mdx exports and attach named __toc export
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
            title ||= getFlattenedValue(node)
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
    file.data.title = title

    if (isRemoteContent) {
      // Attach headings for remote content, because we can't access to __toc variable
      file.data.headings = headings
      done()
      return
    }

    const headingElements = headings.map(heading =>
      typeof heading === 'string'
        ? {
            type: 'SpreadElement',
            argument: { type: 'Identifier', name: heading }
          }
        : {
            type: 'ObjectExpression',
            properties: Object.entries(heading).map(([key, value]) => ({
              type: 'Property',
              kind: 'init',
              key: { type: 'Identifier', name: key },
              value: { type: 'Literal', value }
            }))
          }
    )

    tree.children.push({
      type: 'mdxjsEsm',
      data: {
        estree: {
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: exportName },
                    init: { type: 'ArrayExpression', elements: headingElements }
                  }
                ]
              }
            }
          ]
        }
      }
    } as any)

    done()
  }
}
