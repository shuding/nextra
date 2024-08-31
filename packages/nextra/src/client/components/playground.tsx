import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { CrossCircledIcon } from '../icons/index.js'
import type { MDXComponents } from '../mdx.js'
import { Code } from './code.js'
import { Pre } from './pre.js'
import { evaluate } from './remote-content.js'

export function Playground({
  source,
  scope,
  components,
  fallback = null
}: {
  /**
   * String with source MDX
   *
   * @example '# hello world <br /> nice to see you'
   */
  source: string
  /**
   * An object mapping names to React components.
   * The key used will be the name accessible to MDX.
   *
   * @example `{ ComponentName: Component }` will be accessible in the MDX as `<ComponentName/>`.
   */
  components?: MDXComponents
  /**
   * Pass-through variables for use in the MDX content
   */
  scope?: Record<string, unknown>
  /**
   * Fallback component for loading
   */
  fallback?: ReactElement | null
}) {
  const [compiledSource, setCompiledSource] = useState('')
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    async function doCompile() {
      // Importing in useEffect to not increase global bundle size
      const { compileMdx } = await import('../../server/compile.js')
      try {
        const mdx = await compileMdx(source)
        setCompiledSource(mdx.result)
        setError(null)
      } catch (error) {
        setError(error)
      }
    }

    doCompile()
  }, [source])

  if (error) {
    return (
      <div className="[&_svg]:_text-red-500">
        <Pre
          data-filename="Could not compile code"
          icon={CrossCircledIcon}
          className="_whitespace-pre-wrap"
        >
          <Code>
            <span>
              {error instanceof Error
                ? `${error.name}: ${error.message}`
                : String(error)}
            </span>
          </Code>
        </Pre>
      </div>
    )
  }

  if (compiledSource) {
    const MDXContent = evaluate(compiledSource, scope).default
    return <MDXContent components={components} />
  }

  return fallback
}
