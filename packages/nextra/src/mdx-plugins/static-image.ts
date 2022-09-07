import { visit } from 'unist-util-visit'
import { Plugin } from 'unified'
import { Root } from 'mdast'

// Based on the remark-embed-images project
// https://github.com/remarkjs/remark-embed-images

const relative = /^\.{1,2}\//

const getASTNodeImport = (name: string, from: string) => ({
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
})

export const remarkStaticImage: Plugin<
  [{ allowFutureImage?: boolean }],
  Root
> =
  ({ allowFutureImage }) =>
  (tree, _file, done) => {
    const importsToInject: any[] = []

    visit(tree, 'image', node => {
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
    })

    tree.children.unshift(
      getASTNodeImport(
        '$NextImageNextra',
        allowFutureImage ? 'next/future/image' : 'next/image'
      ) as any,
      ...importsToInject
    )
    done()
  }
