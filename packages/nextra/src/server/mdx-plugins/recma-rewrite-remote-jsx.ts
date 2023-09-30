import type {
  CallExpression,
  FunctionDeclaration,
  Program,
  ReturnStatement
} from 'estree'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { DEFAULT_PROPERTY_PROPS } from '../constants.js'

export const recmaRewriteRemoteJsx: Plugin<[], Program> =
  () => (ast: Program, file) => {
    // console.dir(ast.body, { depth: 6 })
    // ast.body = ast.body
    //   // Remove `export default MDXContent;`
    //   .filter(
    //     node =>
    //       node.type !== 'ExportDefaultDeclaration' ||
    //       // @ts-expect-error fixme
    //       node.declaration.name !== 'MDXContent'
    //   )
    //   // Remove `MDXContent` since we use custom HOC_MDXContent
    //   .filter(
    //     node =>
    //       node.type !== 'FunctionDeclaration' ||
    //       // @ts-expect-error fixme
    //       node.id.name !== 'MDXContent'
    //   )
    //
    const createMdxContent = ast.body.find(
      o =>
        o.type === 'FunctionDeclaration' && o.id!.name === '_createMdxContent'
    ) as FunctionDeclaration

    const returnStatement = createMdxContent.body.body.find(
      o => o.type === 'ReturnStatement'
    ) as ReturnStatement

    const { argument } = returnStatement as any
    // console.log('1111\n\n\n\n', argument)

    // if return statements doesn't wrap in fragment children will be []
    const returnBody = argument.children.length ? argument.children : [argument]
    // console.log('2222\n\n\n\n', returnBody)
    // @ts-expect-error
    visit({ children: returnBody }, 'JSXElement', node => {
      // @ts-expect-error
      if (node.openingElement.name.name === 'RemoteContent') {
        createMdxContent.body.body.unshift({
          type: 'VariableDeclaration',
          kind: 'const',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: {
                type: 'ObjectPattern',
                properties: [
                  {
                    ...DEFAULT_PROPERTY_PROPS,
                    key: { type: 'Identifier', name: 'frontMatter' },
                    value: { type: 'Identifier', name: 'frontMatter' },
                    shorthand: true
                  },
                  // {
                  //   ...DEFAULT_PROPERTY_PROPS,
                  //   key: { type: 'Identifier', name: 'useTOC' },
                  //   value: { type: 'Identifier', name: 'useTOC' },
                  //   shorthand: true
                  // },
                  {
                    ...DEFAULT_PROPERTY_PROPS,
                    key: { type: 'Identifier', name: 'MDXRemote' },
                    value: { type: 'Identifier', name: 'MDXRemote' },
                    shorthand: true
                  }
                ]
              },
              init: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'RemoteContent' },
                arguments: [],
                optional: false
              }
            }
          ]
        })
        // @ts-expect-error
        node.openingElement.name.name = 'MDXRemote'
      }
    })

    // const returnStatement = createMdxContent.body.body.find(
    //   o => o.type === 'ReturnStatement'
    // ) as ReturnStatement
    //
    // const { argument } = returnStatement as any
    //
    // // if return statements doesn't wrap in fragment children will be []
    // const returnBody = argument.children.length ? argument.children : [argument]
    //
    // const tocProperties = file.data.toc as (
    //   | { properties: { id: string } }
    //   | string
    // )[]
    //
    // // Do not add `const toc = useTOC(props)`
    // if (!tocProperties.length) return

    // visit({ children: returnBody }, 'JSXElement', (heading: any) => {
    //   const { openingElement } = heading
    //   const name = openingElement?.name.property?.name
    //   const isHeading = name && TOC_HEADING_REGEX.test(name)
    //   if (!isHeading) return
    //
    //   const idNode = openingElement.attributes.find(
    //     (attr: JsxAttribute) => attr.name.name === 'id'
    //   )
    //   if (!idNode) return
    //
    //   const id = idNode.value.value
    //
    //   const foundIndex = tocProperties.findIndex(node => {
    //     if (typeof node === 'string') return
    //     return node.properties.id === id
    //   })
    //
    //   if (foundIndex === -1) return
    //   idNode.value = {
    //     type: 'JSXExpressionContainer',
    //     expression: {
    //       type: 'Identifier',
    //       name: `toc[${foundIndex}].id`
    //     }
    //   }
    //
    //   delete openingElement.selfClosing
    //   heading.children = [
    //     {
    //       type: 'JSXExpressionContainer',
    //       expression: {
    //         type: 'Identifier',
    //         name: `toc[${foundIndex}].value`
    //       }
    //     }
    //   ]
    //   heading.closingElement = {
    //     ...openingElement,
    //     type: 'JSXClosingElement',
    //     attributes: []
    //   }
    // })

    // const useTOC = {
    //   type: 'CallExpression',
    //   callee: { type: 'Identifier', name: 'useTOC' },
    //   arguments: [{ type: 'Identifier', name: 'props' }],
    //   optional: false
    // } satisfies CallExpression

    // createMdxContent.params = [{ type: 'Identifier', name: 'props' }]
    // // Needs for partial imports since we remove `export default MDXContent` for them
    // createMdxContent.body.body.unshift({
    //   type: 'VariableDeclaration',
    //   kind: 'const',
    //   declarations: [
    //     {
    //       type: 'VariableDeclarator',
    //       id: {
    //         type: 'ObjectPattern',
    //         properties: [
    //           {
    //             ...DEFAULT_PROPERTY_PROPS,
    //             key: { type: 'Identifier', name: 'toc' },
    //             value: {
    //               type: 'AssignmentPattern',
    //               left: { type: 'Identifier', name: 'toc' },
    //               right: useTOC
    //             },
    //             shorthand: true
    //           }
    //         ]
    //       },
    //       init: { type: 'Identifier', name: 'props' }
    //     }
    //   ]
    // })
  }
