import path from 'node:path'
import type { Root } from 'mdast'
import slash from 'slash'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { EXTERNAL_URL_REGEX, PUBLIC_DIR } from '../constants'
import { existsSync } from '../file-system'
import { truthy } from '../utils'

/**
 * @link https://github.com/vercel/next.js/blob/6cfebfb02c2a52a1f99fca59a2eac2d704d053db/packages/next/build/webpack/loaders/next-image-loader.js#L6
 * @link https://github.com/vercel/next.js/blob/6cfebfb02c2a52a1f99fca59a2eac2d704d053db/packages/next/client/image.tsx#LL702
 */
const VALID_BLUR_EXT = ['.jpeg', '.png', '.webp', '.avif', '.jpg']

// Based on the remark-embed-images project
// https://github.com/remarkjs/remark-embed-images
export const remarkStaticImage: Plugin<[], Root> =
  () => (tree, _file, done) => {
    const importsToInject: { variableName: string; importPath: string }[] = []

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
      // Unique variable name for the given static image URL
      const variableName = `__img${importsToInject.length}`
      const hasBlur = VALID_BLUR_EXT.some(ext => url.endsWith(ext))
      importsToInject.push({ variableName, importPath: url })
      // Replace the image node with an MDX component node (Next.js Image)
      Object.assign(node, {
        type: 'mdxJsxFlowElement',
        name: 'img',
        attributes: [
          // do not render empty alt in html markup
          node.alt && {
            type: 'mdxJsxAttribute',
            name: 'alt',
            value: node.alt
          },
          hasBlur && {
            type: 'mdxJsxAttribute',
            name: 'placeholder',
            value: 'blur'
          },
          {
            type: 'mdxJsxAttribute',
            name: 'src',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value: variableName,
              data: {
                estree: {
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: { type: 'Identifier', name: variableName }
                    }
                  ]
                }
              }
            }
          }
        ].filter(truthy)
      })
    })

    if (importsToInject.length) {
      tree.children.unshift(
        ...importsToInject.map(
          ({ variableName, importPath }) =>
            ({
              type: 'mdxjsEsm',
              data: {
                estree: {
                  body: [
                    {
                      type: 'ImportDeclaration',
                      source: { type: 'Literal', value: importPath },
                      specifiers: [
                        {
                          type: 'ImportDefaultSpecifier',
                          local: { type: 'Identifier', name: variableName }
                        }
                      ]
                    }
                  ]
                }
              }
            }) as any
        )
      )
    }

    done()
  }
