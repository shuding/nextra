import { visit } from 'unist-util-visit'
import { Plugin } from 'unified'
import { Root } from 'mdast'
import path from 'node:path'
import { truthy } from '../utils'
import { existsSync } from '../file-system'
import { EXTERNAL_URL_REGEX, PUBLIC_DIR } from '../constants'

const getASTNodeImport = (name: string, from: string) => ({
  type: 'mdxjsEsm',
  value: `import ${name} from "${from}"`,
  data: {
    estree: {
      type: 'Program',
      sourceType: 'module',
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
      ]
    }
  }
})

// Based on the remark-embed-images project
// https://github.com/remarkjs/remark-embed-images
export const remarkStaticImage: Plugin<[{ filePath: string }], Root> =
  ({ filePath }) =>
  (tree, _file, done) => {
    const importsToInject: any[] = []

    visit(tree, 'image', node => {
      let { url } = node
      if (!url) {
        console.warn(
          `[nextra] File "${filePath}" contain image with empty "src" property, skipping…`
        )
        return
      }

      if (EXTERNAL_URL_REGEX.test(url)) {
        // do nothing with images with external url
        return
      }

      if (url.startsWith('/')) {
        const urlPath = path.join(PUBLIC_DIR, url)
        if (!existsSync(urlPath)) {
          console.error(
            `[nextra] File "${filePath}" contain image with url "${url}" that not found in "/public" directory, skipping…`
          )
          return
        }
        url = urlPath
      }
      // Unique variable name for the given static image URL.
      const tempVariableName = `$nextraImage${importsToInject.length}`

      // Replace the image node with a MDX component node (Next.js Image).
      Object.assign(node, {
        type: 'mdxJsxFlowElement',
        name: '$NextImageNextra',
        children: [],
        attributes: [
          // do not render empty alt in html markup
          node.alt && {
            type: 'mdxJsxAttribute',
            name: 'alt',
            value: node.alt
          },
          !url.endsWith('.svg') && {
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
                  sourceType: 'module',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'Identifier',
                        name: tempVariableName
                      }
                    }
                  ]
                }
              }
            }
          }
        ].filter(truthy)
      })

      // Inject the static image import into the root node.
      importsToInject.push(getASTNodeImport(tempVariableName, url))
    })

    tree.children.unshift(
      getASTNodeImport('$NextImageNextra', 'next/image') as any,
      ...importsToInject
    )
    done()
  }
