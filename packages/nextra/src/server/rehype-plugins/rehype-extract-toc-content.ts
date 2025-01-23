import type { SpreadElement } from 'estree'
import type { Element, Root, Text } from 'hast'
import { toEstree } from 'hast-util-to-estree'
import type { MdxjsEsmHast } from 'mdast-util-mdxjs-esm'
import type { Plugin, Transformer } from 'unified'
import { SKIP, visit } from 'unist-util-visit'
import type { Heading } from '../../types.js'
import { createAstExportConst, createAstObject } from '../utils.js'

const TOC_HEADING_RE = /^h[2-6]$/

const transformer: Transformer<Root> = (ast, file) => {
  const TocMap: Record<string, Element> = {}
  visit(ast, 'element', (node, _index, parent) => {
    if (!TOC_HEADING_RE.test(node.tagName)) return
    if (parent && 'properties' in parent && parent.properties.dataFootnotes) {
      return SKIP
    }
    const { id } = node.properties
    TocMap[id as string] = node
  })

  const hasPartialMDX = (file.data.toc as Heading[]).some(
    name => typeof name === 'string'
  )

  const elements = (file.data.toc as Heading[]).map((name, index) => {
    if (typeof name === 'string') {
      return {
        type: 'SpreadElement',
        argument: { type: 'Identifier', name }
      } satisfies SpreadElement
    }

    const node = TocMap[name.id]!

    const isTextOnly = node.children.every(child => child.type === 'text')

    const result = isTextOnly
      ? node.children.map(n => (n as Text).value).join('')
      : // @ts-expect-error -- fixme
        Object.assign(toEstree(node).body[0].expression, {
          type: 'JSXFragment',
          openingFragment: { type: 'JSXOpeningFragment' },
          closingFragment: { type: 'JSXClosingFragment' }
        })

    // Example:
    //
    // ```mdx
    // import Foo from './foo.mdx'
    // # One
    // <Foo />
    // # Two <- will fails if Foo contains 0 toc items
    // ```
    //
    // TODO: We can't know right toc index, because we don't know how many toc items exist in partial toc
    // maybe we could refactor to have offset in the future
    // this fix TypeError: Cannot read properties of undefined (reading 'id')
    if (!hasPartialMDX) {
      Object.assign(node, {
        type: 'mdxJsxFlowElement',
        name: node.tagName,
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'id',
            value: createComputedKey(
              'mdxJsxAttributeValueExpression',
              index,
              'id'
            )
          }
        ],
        children: [createComputedKey('mdxFlowExpression', index, 'value')]
      })
    }

    return createAstObject({
      value: result,
      id: node.properties.id as string,
      depth: Number(node.tagName[1])
    })
  })

  ast.children.push({
    type: 'mdxjsEsm',
    data: {
      estree: {
        body: [
          {
            // TOC links must be inside a function, in our case inside useTOC, so
            // mdx components will be injected for `<a>` or `<code>` tags inside headings
            type: 'FunctionDeclaration',
            id: { type: 'Identifier', name: 'useTOC' },
            params: [{ type: 'Identifier', name: 'props' }],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: { type: 'ArrayExpression', elements }
                }
              ]
            }
          },
          createAstExportConst('toc', {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useTOC' },
            // https://github.com/shuding/nextra/issues/3979
            arguments: [{ type: 'ObjectExpression', properties: [] }],
            optional: false
          })
        ]
      }
    }
  } as MdxjsEsmHast)
}

function createComputedKey(
  type: 'mdxFlowExpression' | 'mdxJsxAttributeValueExpression',
  index: number,
  key: string
) {
  return {
    type,
    data: {
      estree: {
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              property: { type: 'Identifier', name: key },
              object: {
                type: 'MemberExpression',
                object: { type: 'Identifier', name: 'toc' },
                property: { type: 'Literal', value: index },
                computed: true
              }
            }
          }
        ]
      }
    }
  }
}

export const rehypeExtractTocContent: Plugin<[], Root> = () => transformer
