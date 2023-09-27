import type { Plugin } from 'unified'

export const recmaRewriteJsx: Plugin<[], any> = () => ast => {
  const createMdxContent = ast.body.find(
    o => o.type === 'FunctionDeclaration' && o.id.name === '_createMdxContent'
  )
  const returnStatementIndex = createMdxContent.body.body.findIndex(
    o => o.type === 'ReturnStatement'
  )

  const returnStatement = createMdxContent.body.body[returnStatementIndex]
  const isHeading = (o: any): boolean => {
    const name = o.openingElement?.name.property?.name
    if (!name) return false
    return new Set(['h2', 'h3', 'h4', 'h5', 'h6']).has(name)
  }
  const headings = returnStatement.argument.children.filter(isHeading)
  const toc = ast.body.find(
    o =>
      o.type === 'ExportNamedDeclaration' &&
      o.declaration.declarations[0].id.name === 'toc'
  )

  const tocProperties = toc.declaration.declarations[0].init.elements

  // console.dir(, { depth: 6 })
  for (const heading of headings) {
    const idNode = heading.openingElement.attributes.find(
      attr => attr.name.name === 'id'
    )

    const id = idNode.value.value

    const foundIndex = tocProperties.findIndex(o => {
      if (o.type !== 'ObjectExpression') return false
      const object = Object.fromEntries(
        o.properties.map(prop => [prop.key.name, prop.value.value])
      )
      return object.id === id
    })

    if (foundIndex === -1) continue

    const valueNode = tocProperties[foundIndex].properties.find(
      prop => prop.key.name === 'value'
    )

    const isMatch = heading.children.some(
      child =>
        child.type !== 'JSXExpressionContainer' ||
        child.expression.type !== 'Literal'
    )

    if (isMatch) {
      valueNode.value = {
        type: 'JSXFragment',
        openingFragment: {
          type: 'JSXOpeningFragment',
          attributes: [],
          selfClosing: false
        },
        closingFragment: {
          type: 'JSXClosingFragment'
        },
        children: heading.children
      }
    }

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
  }

  createMdxContent.body.body.splice(returnStatementIndex - 1, 0, {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'Identifier',
        name: 'toc'
      },
      right: {
        type: 'ArrayExpression',
        elements: toc.declaration.declarations[0].init.elements
      }
    }
  })

  // Set toc as let and as empty array
  toc.declaration.kind = 'let'
  toc.declaration.declarations[0].init.elements = []
}
