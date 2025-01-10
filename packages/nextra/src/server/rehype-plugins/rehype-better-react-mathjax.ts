import type { ImportDeclaration } from 'estree'
import { valueToEstree } from 'estree-util-value-to-estree'
import type { Element, ElementContent, Root } from 'hast'
import type { MdxJsxAttribute, MdxJsxFlowElementHast } from 'mdast-util-mdx-jsx'
import type { MdxjsEsmHast } from 'mdast-util-mdxjs-esm'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { MathJaxOptions } from '../../types.js'

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
} as MdxjsEsmHast

function wrapInMathJaxContext(
  children: ElementContent[],
  { config, src }: NonNullable<MathJaxOptions>
): MdxJsxFlowElementHast {
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
              { type: 'ExpressionStatement', expression: valueToEstree(config) }
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
  mathInline: boolean,
  options: NonNullable<MathJaxOptions>
): string {
  const { inlineMath, displayMath } = options.config?.tex || {}

  const inlineBraces = inlineMath?.[0] || [String.raw`\(`, String.raw`\)`]
  const displayBraces = displayMath?.[0] || [String.raw`\[`, String.raw`\]`]
  const [before, after] = mathInline ? inlineBraces : displayBraces
  return `${before}${source}${after}`
}

/**
 * Wraps math in a `<MathJax>` component so that it can be rendered by `better-react-mathjax`.
 */
export const rehypeBetterReactMathjax: Plugin<
  [Opts: MathJaxOptions, isRemoteContent: boolean],
  Root
> =
  (options = {}, isRemoteContent) =>
  ast => {
    let hasMathJax = false

    visit(ast, { tagName: 'code' }, (node, _index, parent) => {
      const classes = Array.isArray(node.properties.className)
        ? node.properties.className
        : []
      // This class can be generated from markdown with ` ```math `
      const hasMathLanguage = classes.includes('language-math')
      if (!hasMathLanguage) return

      // This class is used by `remark-math` for text math (inline, `$math$`)
      const isInlineMath = classes.includes('math-inline')

      const [{ value }] = node.children as any
      const bracketedValue = wrapInBraces(value, isInlineMath, options)

      const mathJaxNode: Element = {
        type: 'element',
        tagName: 'MathJax',
        children: [{ type: 'text', value: bracketedValue }],
        properties: isInlineMath ? { inline: true } : {}
      }

      Object.assign((isInlineMath ? node : parent) as any, mathJaxNode)
      hasMathJax = true
    })

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- fixme
    if (!hasMathJax) return

    const mdxjsEsmNodes = []
    const rest: ElementContent[] = []
    for (const child of ast.children) {
      if (child.type === 'mdxjsEsm') {
        mdxjsEsmNodes.push(child)
      } else {
        rest.push(child as any)
      }
    }
    ast.children = [
      ...mdxjsEsmNodes,
      ...(isRemoteContent ? [] : [MATHJAX_IMPORTS]),
      // Wrap everything in a `<MathJaxContext>` component.
      wrapInMathJaxContext(rest, options)
    ]
  }
