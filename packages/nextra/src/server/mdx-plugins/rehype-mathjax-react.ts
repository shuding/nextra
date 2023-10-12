import type { Element, Root } from 'hast'
import { toText } from 'hast-util-to-text'
import { SKIP, visitParents } from 'unist-util-visit-parents'
import type { VFile } from 'vfile'

/** @type {Readonly<Options>} */
const emptyOptions = {}
/** @type {ReadonlyArray<unknown>} */
const emptyClasses: string[] = []

export type Options = Record<string, unknown> | undefined

/**
 * Render elements with a `language-math` (or `math-display`, `math-inline`)
 * class with KaTeX.
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export function rehypeReactMathjax(options: Options) {
  const _settings = options || emptyOptions

  /**
   * Transform.
   */
  return function (tree: Root, _file: VFile) {
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

      const result: Element[] = [
        {
          type: 'element',
          tagName: 'MathJax',
          children: [{ type: 'text', value: bracketedValue }],
          properties: displayMode ? {} : { inline: true }
        }
      ]
      if (!displayMode) {
        result[0].properties.inline = true
      }

      const index = parent.children.indexOf(scope)
      parent.children.splice(index, 1, ...result)
      return SKIP
    })
  }
}
