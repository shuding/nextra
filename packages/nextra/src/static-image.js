// Based on the remark-embed-images project
// https://github.com/remarkjs/remark-embed-images

const relative = /^\.{1,2}\//

function visit(node, type, handler) {
  if (node.type === type) {
    handler(node)
  }
  if (node.children) {
    node.children.forEach(n => visit(n, type, handler))
  }
}

function ASTNodeImport(name, from) {
  return {
    type: 'mdxjsEsm',
    value: `import ${name} from "${from}"`,
    data: {
      estree: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: { type: 'Identifier', name }
              }
            ],
            source: {
              type: 'Literal',
              value: from,
              raw: `"${from}"`
            }
          }
        ],
        sourceType: 'module'
      }
    }
  }
}

export function remarkStaticImage() {
  return (tree, _file, done) => {
    const importsToInject = []

    visit(tree, 'image', visitor)
    tree.children.unshift(...importsToInject)
    tree.children.unshift(ASTNodeImport('$NextImageNextra', 'next/image'))
    done()

    function visitor(node) {
      const url = node.url

      if (url && relative.test(url)) {
        // Unique variable name for the given static image URL.
        const tempVariableName = `$nextraImage${importsToInject.length}`

        // Replace the image node with a MDX component node (Next.js Image).
        Object.assign(node, {
          type: 'mdxJsxFlowElement',
          name: '$NextImageNextra',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'alt',
              value: node.alt || ''
            },
            {
              type: 'mdxJsxAttribute',
              name: 'placeholder',
              value: 'blur'
            },
            {
              type: 'mdxJsxAttribute',
              name: 'src',
              value: {
                type: 'mdxJsxAttributeValueExpression',
                value: tempVariableName,
                data: {
                  estree: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'Identifier',
                          name: tempVariableName
                        }
                      }
                    ],
                    sourceType: 'module'
                  }
                }
              }
            }
          ],
          children: []
        })

        // Inject the static image import into the root node.
        importsToInject.push(ASTNodeImport(tempVariableName, url))
      }
    }
  }
}
