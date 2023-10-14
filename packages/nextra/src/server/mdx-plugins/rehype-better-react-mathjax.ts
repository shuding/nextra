import type { MathJax3Config } from 'better-react-mathjax'
import type { ImportDeclaration, ImportSpecifier } from 'estree'
import type { Element, Root, RootContent } from 'hast'
import type { MdxJsxAttribute } from 'hast-util-to-estree/lib'
import { toText } from 'hast-util-to-text'
import type { Plugin } from 'unified'
import { SKIP, visitParents } from 'unist-util-visit-parents'

const emptyOptions = {}
const emptyClasses: string[] = []

export type Options = { src?: string; config?: MathJax3Config } | undefined

function createImport(name: string) {
  return {
    type: 'mdxjsEsm',
    data: {
      estree: {
        body: [
          {
            type: 'ImportDeclaration',
            source: { type: 'Literal', value: 'better-react-mathjax' },
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: { type: 'Identifier', name },
                local: { type: 'Identifier', name }
              }
            ]
          } satisfies ImportDeclaration
        ]
      }
    }
  }
}

function wrapInMathJaxContext(
  children: RootContent[],
  options: NonNullable<Options>
) {
  const config = options.config || {}
  const attributes: MdxJsxAttribute[] =
    Object.keys(config).length === 0
      ? []
      : [
          {
            type: 'mdxJsxAttribute',
            name: 'config',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value: `JSON.parse(${JSON.stringify(JSON.stringify(config))})`,
              data: {
                estree: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: { type: 'Identifier', name: 'JSON' },
                          property: { type: 'Identifier', name: 'parse' },
                          computed: false,
                          optional: false
                        },
                        arguments: [
                          {
                            type: 'Literal',
                            value: JSON.stringify(config),
                            raw: JSON.stringify(JSON.stringify(config))
                          }
                        ],
                        optional: false
                      }
                    }
                  ],
                  sourceType: 'module',
                  comments: []
                }
              }
            }
          }
        ]
  if (options.src) {
    attributes.push({
      type: 'mdxJsxAttribute',
      name: 'src',
      value: options.src
    })
  }

  return {
    type: 'root',
    children: [
      {
        type: 'mdxJsxFlowElement',
        name: 'MathJaxContext',
        attributes,
        children,
        data: {
          _mdxExplicitJsx: true
        }
      }
    ]
  }
}

const isMdxJsEsm = (node: any) => node.type === 'mdxjsEsm'
const isImportDeclaration = (node: any) =>
  node.data.estree.body[0].type === 'ImportDeclaration'
const isImportFrom = (node: any) =>
  node.data.estree.body[0].source.value === 'better-react-mathjax'

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
  const braces = displayMath ? displayBraces : inlineBraces
  return `${braces[0]}${source}${braces[1]}`
}

/**
 * Wraps math in a `<MathJax>` component so that it can be rendered by `better-react-mathjax`.
 */
export const rehypeBetterReactMathjax: Plugin<[Options], Root> = options => {
  const settings = options || emptyOptions

  /**
   * Transform.
   */
  return tree => {
    let insertedMath = false

    visitParents(tree, 'element', (element, parents) => {
      const classes = Array.isArray(element.properties.className)
        ? element.properties.className
        : emptyClasses
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
      const bracketedValue = wrapInBraces(value, displayMode, settings)

      const result: Element = {
        type: 'element',
        tagName: 'MathJax',
        children: [{ type: 'text', value: bracketedValue }],
        properties: displayMode ? {} : { inline: true }
      }

      const index = parent.children.indexOf(scope)
      parent.children.splice(index, 1, result)
      insertedMath = true
      return SKIP
    })

    if (insertedMath) {
      // Add the import statement if one is not present.
      const imports = tree.children.filter(
        (node: any) =>
          isMdxJsEsm(node) && isImportDeclaration(node) && isImportFrom(node)
      )
      // Look for `MathJax` and `MathJaxContext` in the import statements.
      const included = { MathJax: false, MathJaxContext: false }
      for (const { data: _data } of imports) {
        const data = _data as any
        const [{ specifiers }]: [{ specifiers: ImportSpecifier[] }] =
          data.estree.body
        for (const spec of specifiers) {
          if (spec.imported.name === 'MathJax') {
            included.MathJax = true
          } else if (spec.imported.name === 'MathJaxContext') {
            included.MathJaxContext = true
          }
        }
      }

      // Wrap everything in a `<MathJaxContext>` component.
      tree.children = [wrapInMathJaxContext(tree.children, settings) as any]

      // if (!included.MathJax) {
      //   tree.children.push(createImport('MathJax') as any)
      // }
      // if (!included.MathJaxContext) {
      //   tree.children.push(createImport('MathJaxContext') as any)
      // }
    }
  }
}
