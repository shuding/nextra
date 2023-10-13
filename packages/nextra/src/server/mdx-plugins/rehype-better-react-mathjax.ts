import type { MathJaxContextProps } from 'better-react-mathjax'
import type { ImportDeclaration, ImportSpecifier } from 'estree'
import type { Element, Root } from 'hast'
import { toText } from 'hast-util-to-text'
import { SKIP, visitParents } from 'unist-util-visit-parents'

const emptyOptions = {}
const emptyClasses: string[] = []

export type Options = MathJaxContextProps | undefined

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
const isMdxJsEsm = (node: any) => node.type === 'mdxjsEsm'
const isImportDeclaration = (node: any) =>
  node.data.estree.body[0].type === 'ImportDeclaration'
const isImportFrom = (node: any) =>
  node.data.estree.body[0].source.value === 'better-react-mathjax'

/**
 * Wraps math in a `<MathJax>` component so that it can be rendered by `better-react-mathjax`.
 */
export function rehypeBetterReactMathjax(options: Options) {
  const _settings = options || emptyOptions

  /**
   * Transform.
   */
  return function (tree: Root) {
    let insertedMath = false

    visitParents(tree, 'element', function (element, parents) {
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

      let parent = parents[parents.length - 1]
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
        parent = parents[parents.length - 2]
        displayMode = true
      }

      /* c8 ignore next -- verbose to test. */
      if (!parent) {
        return
      }

      const value = toText(scope, { whitespace: 'pre' })
      const bracketedValue = displayMode ? `\\[${value}\\]` : `\\(${value}\\)`

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
          }
          if (spec.imported.name === 'MathJaxContext') {
            included.MathJaxContext = true
          }
        }
      }
      if (!included.MathJax) {
        tree.children.push(createImport('MathJax') as any)
      }
      if (!included.MathJaxContext) {
        tree.children.push(createImport('MathJaxContext') as any)
      }

      // Wrap everything in a `<MathJaxContext>` component.
      // XXX: we should only wrap the content of the page, not the import statements... How to do this?
    }
  }
}
