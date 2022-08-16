// Based on the remark-embed-images project
// https://github.com/remarkjs/remark-embed-images
import { getASTNodeImport } from './utils'

const relative = /^\.{1,2}\//

function visit(node, type, handler) {
  if (node.type === type) {
    handler(node)
  }
  node.children?.forEach(n => visit(n, type, handler))
}

export const remarkStaticImage = () => (tree, _file, done) => {
    const importsToInject = []

    visit(tree, 'image', visitor)
    tree.children.unshift(
      getASTNodeImport('$NextImageNextra', 'next/image'),
      ...importsToInject
    )
    done()

    function visitor(node) {
      const { url } = node

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
        importsToInject.push(getASTNodeImport(tempVariableName, url))
      }
    }
}
