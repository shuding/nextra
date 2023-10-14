import type { ImportDeclaration } from 'estree'
import { valueToEstree } from 'estree-util-value-to-estree'
import type { Element, Root, RootContent } from 'hast'
import type { MdxJsxAttribute } from 'hast-util-to-estree/lib'
import { toText } from 'hast-util-to-text'
import type { Plugin } from 'unified'
import { SKIP, visitParents } from 'unist-util-visit-parents'
import type { MathJaxOptions } from '../../types'

export type Options = MathJaxOptions

const MATHJAX_IMPORTS = {
  type: 'mdxjsEsm',
  data: {
    estree: {
      body: [
        {
          type: 'ImportDeclaration',
          source: { type: 'Literal', value: 'nextra/components' },
          specifiers: ['MathJax', 'MathJaxContext'].map(name => ({
            type: 'ImportSpecifier',
            imported: { type: 'Identifier', name },
            local: { type: 'Identifier', name }
          }))
        } satisfies ImportDeclaration
      ]
    }
  }
}

function wrapInMathJaxContext(
  children: RootContent[],
  { config, src }: NonNullable<Options>
) {
  const attributes: MdxJsxAttribute[] = []
  if (src) {
    attributes.push({ type: 'mdxJsxAttribute', name: 'src', value: src })
  }
  if (config && Object.keys(config).length) {
    attributes.push({
      type: 'mdxJsxAttribute',
      name: 'config',
      value: {
        type: 'mdxJsxAttributeValueExpression',
        value: '',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ExpressionStatement',
                expression: valueToEstree(config)
              }
            ]
          }
        }
      }
    })
  }

  return {
    type: 'mdxJsxFlowElement',
    name: 'MathJaxContext',
    attributes,
    children
  }
}

/**
 * Wrap the math in the appropriate braces. Defaults to `\(...\)` for inline and `\[...\]` for display,
 * but will use the braces provided by `options` if they are present.
 */
function wrapInBraces(
  source: string,
  displayMath: boolean,
  options: NonNullable<Options>
): string {
  const inlineBraces = options?.config?.tex?.inlineMath?.[0] || ['\\(', '\\)']
  const displayBraces = options?.config?.tex?.displayMath?.[0] || ['\\[', '\\]']
  const [before, after] = displayMath ? displayBraces : inlineBraces
  return `${before}${source}${after}`
}

/**
 * Wraps math in a `<MathJax>` component so that it can be rendered by `better-react-mathjax`.
 */
export const rehypeBetterReactMathjax: Plugin<
  [Opts: Options, isRemoteContent: boolean],
  Root
> =
  (options = {}, isRemoteContent) =>
  tree => {
    let hasMathJax = false

    visitParents(tree, 'element', (element, parents) => {
      const classes = Array.isArray(element.properties.className)
        ? element.properties.className
        : []
      // This class can be generated from markdown with ` ```math `.
      const languageMath = classes.includes('language-math')
      // This class is used by `remark-math` for flow math (block, `$$\nmath\n$$`).
      const mathDisplay = classes.includes('math-display')
      // This class is used by `remark-math` for text math (inline, `$math$`).
      const mathInline = classes.includes('math-inline')
      let displayMode = mathDisplay

      // Any class is fine.
      if (!languageMath && !mathDisplay && !mathInline) {
        return
      }

      let parent = parents.at(-1)
      let scope = element

      // If this was generated with ` ```math `, replace the `<pre>` and use
      // display.
      if (
        element.tagName === 'code' &&
        languageMath &&
        parent &&
        parent.type === 'element' &&
        parent.tagName === 'pre'
      ) {
        scope = parent
        parent = parents.at(-2)!
        displayMode = true
      }

      /* c8 ignore next -- verbose to test. */
      if (!parent) {
        return
      }

      const value = toText(scope, { whitespace: 'pre' })
      const bracketedValue = wrapInBraces(value, displayMode, options)

      const result: Element = {
        type: 'element',
        tagName: 'MathJax',
        children: [{ type: 'text', value: bracketedValue }],
        properties: displayMode ? {} : { inline: true }
      }

      const index = parent.children.indexOf(scope)
      parent.children.splice(index, 1, result)
      hasMathJax = true
      return SKIP
    })

    if (!hasMathJax) return

    const mdxjsEsmNodes = []
    const rest = []
    for (const child of tree.children) {
      if (child.type === ('mdxjsEsm' as any)) {
        mdxjsEsmNodes.push(child)
      } else {
        rest.push(child)
      }
    }
    tree.children = [
      ...mdxjsEsmNodes,
      ...(isRemoteContent ? [] : [MATHJAX_IMPORTS]),
      // Wrap everything in a `<MathJaxContext />` component.
      wrapInMathJaxContext(rest, options)
    ] as any
  }
