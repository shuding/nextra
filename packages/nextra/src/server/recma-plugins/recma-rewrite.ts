import type {
  CallExpression,
  FunctionDeclaration,
  ImportDeclaration,
  ObjectExpression,
  Program,
  ReturnStatement
} from 'estree'
import { JsxAttribute } from 'estree-util-to-js/lib/jsx'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { Heading } from '../../types'
import { DEFAULT_PROPERTY_PROPS } from '../constants.js'
import { createAstObject } from '../utils'

enum Mdx {
  Wrapper = 'MDXContent',
  Content = '_createMdxContent'
}

const TOC_HEADING_RE = /^h[2-6]$/

export const recmaRewrite: Plugin<
  [{ isPageImport?: boolean; isRemoteContent?: boolean }],
  Program
> =
  ({ isPageImport, isRemoteContent }) =>
  (ast: Program, file) => {
    const hasMdxLayout = ast.body.some(
      node =>
        node.type === 'VariableDeclaration' &&
        node.kind === 'const' &&
        node.declarations[0].id.type === 'Identifier' &&
        node.declarations[0].id.name === 'MDXLayout'
    )
    // Remote MDX
    if (isRemoteContent) {
      if (hasMdxLayout) {
        return
      }
      // Remove `function MDXContent` with wrapper logic
      ast.body = ast.body.filter(
        node =>
          node.type !== 'FunctionDeclaration' || node.id.name !== Mdx.Wrapper
      )
      const returnStatement = ast.body.find(
        node => node.type === 'ReturnStatement'
      )!
      const { properties } = returnStatement.argument as ObjectExpression
      for (const node of properties) {
        if (
          node.type === 'Property' &&
          node.key.type === 'Identifier' &&
          node.key.name === 'default' &&
          node.value.type === 'Identifier' &&
          node.value.name === Mdx.Wrapper
        ) {
          node.value.name = Mdx.Content
          break
        }
      }
      return
    }
    /*
    const mdxContent = ast.body.find(
      (node): node is FunctionDeclaration =>
        'id' in node &&
        node.id.type === 'Identifier' &&
        node.id.name === '_createMdxContent'
    )!

    const { argument } = mdxContent.body.body.at(-1) as ReturnStatement

    const astObjects: ObjectExpression[] = []

    visit(argument, 'JSXElement', (heading: any) => {
      const { openingElement } = heading
      const { name } = openingElement.name.property
      if (!TOC_HEADING_RE.test(name)) return

      const idNode = openingElement.attributes.find(
        (attr: JsxAttribute) => attr.name.name === 'id'
      )
      if (!idNode) return

      const id = idNode.value.value
      const foundIndex = (file.data.toc as (Heading | string)[]).findIndex(
        item => {
          if (typeof item === 'string') return
          return item.id === id
        }
      )
      if (foundIndex === -1) return

      console.dir(openingElement,{depth:null})

      astObjects.push(createAstObject({
        // value: result,
        id,
        // depth: Number(node.tagName[1])
      }))

      idNode.value = {
        type: 'JSXExpressionContainer',
        expression: {
          type: 'Identifier',
          name: `toc[${foundIndex}].id`
        }
      }
      heading.children = [
        {
          type: 'JSXExpressionContainer',
          expression: {
            type: 'Identifier',
            name: `toc[${foundIndex}].value`
          }
        }
      ]
    })
    ast.body.unshift({
      type: 'ExportNamedDeclaration',
      declaration: {
        type: 'FunctionDeclaration',
        id: {
          type: 'Identifier',
          name: 'useTOC'
        },
        expression: false,
        generator: false,
        async: false,
        params: [{ type: 'Identifier', name: 'props' }],
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ReturnStatement',
              argument: {
                type: 'ArrayExpression',
                elements: astObjects
              }
            }
          ]
        }
      },
      specifiers: []
    })
    console.log(mdxContent)
    */
    const defaultExport = ast.body.find(
      node => node.type === 'ExportDefaultDeclaration'
    )!

    if (hasMdxLayout) {
      // `export default function MDXContent` > `function MDXContent`
      Object.assign(defaultExport, defaultExport.declaration)
      ast.body.unshift(HOC_IMPORT_AST)
      ast.body.push({
        type: 'ExportDefaultDeclaration',
        declaration: createHocCallAst(Mdx.Wrapper)
      })
      return
    }

    // Page MDX
    if (isPageImport) {
      ast.body.unshift(HOC_IMPORT_AST)
      defaultExport.declaration = createHocCallAst(Mdx.Content)
      return
    }
    // Partial MDX
    defaultExport.declaration = {
      type: 'Identifier',
      name: Mdx.Content
    }
  }

const HOC_IMPORT_AST: ImportDeclaration = {
  type: 'ImportDeclaration',
  source: { type: 'Literal', value: 'nextra/setup-page' },
  specifiers: [
    {
      type: 'ImportSpecifier',
      imported: { type: 'Identifier', name: 'HOC_MDXWrapper' },
      local: { type: 'Identifier', name: 'HOC_MDXWrapper' }
    }
  ]
}

function createHocCallAst(componentName: string): CallExpression {
  return {
    type: 'CallExpression',
    callee: { type: 'Identifier', name: 'HOC_MDXWrapper' },
    optional: false,
    arguments: [
      { type: 'Identifier', name: componentName },
      {
        type: 'ObjectExpression',
        properties: [
          {
            ...DEFAULT_PROPERTY_PROPS,
            shorthand: true,
            key: { type: 'Identifier', name: 'metadata' },
            value: { type: 'Identifier', name: 'metadata' }
          },
          {
            ...DEFAULT_PROPERTY_PROPS,
            shorthand: true,
            key: { type: 'Identifier', name: 'toc' },
            value: { type: 'Identifier', name: 'toc' }
          }
        ]
      }
    ]
  }
}
