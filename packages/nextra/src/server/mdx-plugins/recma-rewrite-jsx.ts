import type {
  BaseNode,
  FunctionDeclaration,
  Identifier,
  Literal,
  ObjectExpression,
  Program,
  Property,
  ReturnStatement,
  SpreadElement
} from 'estree'
import type {
  JsxAttribute,
  JsxExpressionContainer
} from 'estree-util-to-js/lib/jsx'
import type { Plugin } from 'unified'

const HEADING_NAMES = new Set(['h2', 'h3', 'h4', 'h5', 'h6'])

export const recmaRewriteJsx: Plugin<[], Program> = () => ast => {
  const createMdxContent = ast.body.find(
    // @ts-expect-error
    o => o.type === 'FunctionDeclaration' && o.id.name === '_createMdxContent'
  ) as FunctionDeclaration
  const returnStatementIndex = createMdxContent.body.body.findIndex(
    o => o.type === 'ReturnStatement'
  )

  const returnStatement = createMdxContent.body.body[
    returnStatementIndex
  ] as ReturnStatement

  // @ts-expect-error
  function isHeading(o): boolean {
    const name = o.openingElement?.name.property?.name
    return name && HEADING_NAMES.has(name)
  }

  // @ts-expect-error
  const headings = returnStatement.argument.children.filter(isHeading)
  const toc = ast.body.find(
    node =>
      node.type === 'ExportNamedDeclaration' &&
      node.declaration &&
      'declarations' in
        node.declaration /* doesn't exist for FunctionDeclaration */ &&
      // @ts-expect-error
      node.declaration.declarations[0].id.name === 'toc'
  ) as any

  const tocProperties = toc.declaration.declarations[0].init.elements as (
    | ObjectExpression
    | SpreadElement
  )[]

  for (const heading of headings) {
    const idNode = heading.openingElement.attributes.find(
      (attr: JsxAttribute) => attr.name.name === 'id'
    )

    const id = idNode.value.value

    const foundIndex = tocProperties.findIndex(node => {
      if (node.type !== 'ObjectExpression') return
      const object = Object.fromEntries(
        // @ts-expect-error
        node.properties.map(prop => [prop.key.name, prop.value.value])
      )
      return object.id === id
    })

    if (foundIndex === -1) continue

    // @ts-expect-error
    const valueNode = tocProperties[foundIndex].properties.find(
      (node: Property) => (node.key as Identifier).name === 'value'
    )

    const isExpressionContainer = (
      node: BaseNode
    ): node is JsxExpressionContainer => node.type === 'JSXExpressionContainer'

    const isIdentifier = (node: BaseNode): node is Identifier =>
      isExpressionContainer(node) && node.expression.type === 'Identifier'

    const isLiteral = (node: BaseNode): node is Literal =>
      isExpressionContainer(node) && node.expression.type === 'Literal'

    idNode.value = {
      type: 'JSXExpressionContainer',
      expression: {
        type: 'Identifier',
        name: `toc[${foundIndex}].id`
      }
    }

    if (
      heading.children.every(
        (node: BaseNode) => isLiteral(node) || isIdentifier(node)
      )
    ) {
      if (!heading.children.every(isLiteral)) {
        valueNode.value = {
          type: 'JSXFragment',
          openingFragment: { type: 'JSXOpeningFragment' },
          closingFragment: { type: 'JSXClosingFragment' },
          children: heading.children
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
    }
  }
}
