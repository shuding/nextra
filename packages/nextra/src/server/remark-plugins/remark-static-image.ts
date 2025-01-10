import path from 'node:path'
import type { ImportDeclaration } from 'estree'
import type { Definition, Image, ImageReference, Root } from 'mdast'
import type { MdxjsEsmHast } from 'mdast-util-mdxjs-esm'
import type { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import { EXTERNAL_URL_RE } from '../constants.js'

/**
 * @link https://github.com/vercel/next.js/blob/6cfebfb02c2a52a1f99fca59a2eac2d704d053db/packages/next/build/webpack/loaders/next-image-loader.js#L6
 * @link https://github.com/vercel/next.js/blob/6cfebfb02c2a52a1f99fca59a2eac2d704d053db/packages/next/client/image.tsx#LL702
 */
const VALID_BLUR_EXT = ['.jpeg', '.png', '.webp', '.avif', '.jpg']

const VARIABLE_PREFIX = '__img'

// Based on the remark-embed-images project
// https://github.com/remarkjs/remark-embed-images
const transformer: Transformer<Root> = ast => {
  const definitionNodes: Definition[] = []

  const imageImports = new Set<string>()
  const imageNodes: (Image | ImageReference)[] = []

  visit(ast, 'definition', node => {
    definitionNodes.push(node)
  })

  visit(ast, ['image', 'imageReference'], _node => {
    const node = _node as Image | ImageReference
    // https://github.com/shuding/nextra/issues/1344
    let url = decodeURI(
      node.type === 'image'
        ? node.url
        : (definitionNodes.find(
            definition => definition.identifier === node.identifier
          )?.url ?? '')
    )

    if (!url) {
      return
    }

    if (EXTERNAL_URL_RE.test(url)) {
      // do nothing with images with external url
      return
    }

    if (url.startsWith('/')) {
      url = path.posix.join('private-next-root-dir', 'public', url)
    }
    imageImports.add(url)
    // @ts-expect-error -- we assign explicitly
    node.url = url
    imageNodes.push(node)
  })

  const imageUrls = [...imageImports]

  for (const node of imageNodes) {
    // @ts-expect-error -- we assigned explicitly
    const { url } = node
    const imageIndex = imageUrls.indexOf(url)
    const variableName = `${VARIABLE_PREFIX}${imageIndex}`
    const hasBlur = VALID_BLUR_EXT.some(ext => url.endsWith(ext))
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
      ].filter(v => !!v)
    })
  }

  if (imageUrls.length) {
    ast.children.unshift(
      ...imageUrls.map(
        (imageUrl, index) =>
          ({
            type: 'mdxjsEsm',
            data: {
              estree: {
                body: [
                  {
                    type: 'ImportDeclaration',
                    source: { type: 'Literal', value: imageUrl },
                    specifiers: [
                      {
                        type: 'ImportDefaultSpecifier',
                        local: {
                          type: 'Identifier',
                          name: `${VARIABLE_PREFIX}${index}`
                        }
                      }
                    ]
                  } satisfies ImportDeclaration
                ]
              }
            }
          }) as MdxjsEsmHast
      )
    )
  }
}

export const remarkStaticImage: Plugin<[], Root> = () => transformer
