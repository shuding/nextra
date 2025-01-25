import Slugger from 'github-slugger'
import type { Literal } from 'hast'
import type { Parent, Root } from 'mdast'
import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute
} from 'mdast-util-mdx-jsx'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { visitChildren } from 'unist-util-visit-children'
import type { Heading } from '../../types.js'
import { MARKDOWN_EXTENSION_RE } from '../constants.js'
import { createAstObject } from '../utils.js'
import type { HProperties } from './remark-custom-heading-id.js'

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

export const remarkHeadings: Plugin<
  [{ exportName?: string; isRemoteContent?: boolean }],
  Root
> = ({ exportName = 'toc', isRemoteContent }) => {
  const headings: (Heading | string)[] = []

  const slugger = new Slugger()
  return (ast, file) => {
    const PartialComponentToHeadingsName: Record<string, string> =
      Object.create(null)

    visit(
      ast,
      [
        'heading',
        // push partial component's `toc` export name to headings list
        'mdxJsxFlowElement',
        // verify .md/.mdx exports and attach named `toc` export
        'mdxjsEsm'
      ],
      (node, index, parent) => {
        if (node.type === 'heading') {
          if (node.depth === 1) {
            return
          }

          node.data ||= {}
          const headingProps: HProperties = (node.data.hProperties ||= {})
          const value = getFlattenedValue(node)
          const id = slugger.slug(headingProps.id || value)
          // Attach flattened/custom #id to heading node
          headingProps.id = id
          headings.push({ depth: node.depth, value, id })
          return
        }

        const isTab =
          node.type === 'mdxJsxFlowElement' && node.name === 'Tabs.Tab'
        if (isTab) {
          const itemsAttr: any =
            parent &&
            parent.type === 'mdxJsxFlowElement' &&
            parent.name === 'Tabs' &&
            parent.attributes.find(
              (
                attr: MdxJsxExpressionAttribute | MdxJsxAttribute
              ): attr is MdxJsxAttribute =>
                attr.type === 'mdxJsxAttribute' && attr.name === 'items'
            )
          if (!itemsAttr) return
          const tabName =
            itemsAttr.value.data.estree.body[0].expression.elements.map(
              (el: Literal) => el.value
            )[index!]
          const id = slugger.slug(tabName)
          node.children.unshift({
            type: 'mdxJsxFlowElement',
            name: 'h3',
            data: { _mdxExplicitJsx: true },
            children: [{ type: 'text', value: tabName }],
            attributes: [
              { type: 'mdxJsxAttribute', name: 'id', value: id },
              {
                type: 'mdxJsxAttribute',
                name: 'style',
                value: {
                  type: 'mdxJsxAttributeValueExpression',
                  value: '',
                  data: {
                    estree: {
                      type: 'Program',
                      sourceType: 'module',
                      comments: [],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: createAstObject({
                            visibility: 'hidden',
                            width: 0,
                            height: 0
                          })
                        }
                      ]
                    }
                  }
                }
              }
            ] satisfies MdxJsxAttribute[]
          } as any)
        }

        const isDetails =
          node.type === 'mdxJsxFlowElement' && node.name === 'details'
        if (isDetails) {
          const visitor = visitChildren((node: any) => {
            const isSummary =
              node.type === 'mdxJsxTextElement' && node.name === 'summary'
            if (isSummary) {
              const value = getFlattenedValue(node)
              const id = slugger.slug(value)
              node.attributes.push({
                type: 'mdxJsxAttribute',
                name: 'id',
                value: id
              })
            } else if ('children' in node) {
              visitor(node)
            }
          })
          visitor(node)
        }

        if (isRemoteContent) {
          // skip
        } else if ((node as any).type === 'mdxjsEsm') {
          for (const child of (node as any).data.estree.body) {
            if (child.type !== 'ImportDeclaration') continue
            const importPath = child.source.value
            const isMdxImport = MARKDOWN_EXTENSION_RE.test(importPath)
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

    file.data.toc = headings
  }
}
