import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import path from 'node:path'
import slash from 'slash'
import { truthy } from '../utils'
import { existsSync } from '../file-system'
import { EXTERNAL_URL_REGEX, PUBLIC_DIR } from '../constants'

/**
 * @ link https://github.com/vercel/next.js/blob/6cfebfb02c2a52a1f99fca59a2eac2d704d053db/packages/next/build/webpack/loaders/next-image-loader.js#L6
 * @ link https://github.com/vercel/next.js/blob/6cfebfb02c2a52a1f99fca59a2eac2d704d053db/packages/next/client/image.tsx#LL702
 */
const VALID_BLUR_EXT = ['.jpeg', '.png', '.webp', '.avif', '.jpg']

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
  () => (tree, _file, done) => {
    const importsToInject: any[] = []

    visit(tree, 'image', node => {
      // https://github.com/shuding/nextra/issues/1344
      let url = decodeURI(node.url)
      if (!url) {
        return
      }

      if (EXTERNAL_URL_REGEX.test(url)) {
        // do nothing with images with external url
        return
      }

      if (url.startsWith('/')) {
        const urlPath = path.join(PUBLIC_DIR, url)
        if (!existsSync(urlPath)) {
          return
        }
        url = slash(urlPath)
      }
      // Unique variable name for the given static image URL.
      const tempVariableName = `$nextraImage${importsToInject.length}`
      const blur = VALID_BLUR_EXT.some(ext => url.endsWith(ext))
      // Replace the image node with an MDX component node (Next.js Image).
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
          blur && {
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
