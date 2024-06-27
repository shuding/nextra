import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { compileMdxClient } from '../compileMdxClient.js'
import { jsxRuntime } from '../jsx-runtime.cjs'
import type { MDXComponents } from '../mdx.js'
import { useMDXComponents } from '../mdx.js'

export function evaluate(
  compiledSource: string,
  scope: Record<string, unknown> = {}
) {
  // if we're ready to render, we can assemble the component tree and let React do its thing
  // first we set up the scope which has to include the mdx custom
  // create element function as well as any components we're using
  const keys = Object.keys(scope)
  const values = Object.values(scope)
  // now we eval the source code using a function constructor
  // in order for this to work we need to have React, the mdx `createElement`,
  // and all our components in scope for the function, which is the case here
  // we pass the names (via keys) in as the function's args, and execute the
  // function with the actual values.
  console.log(compiledSource)
  const hydrateFn = Reflect.construct(Function, ['$', ...keys, compiledSource])

  return hydrateFn({ useMDXComponents, ...jsxRuntime }, ...values)
}

export function Playground({
  source,
  scope,
  components,
  fallback
}: {
  /**
   * String with source MDX
   *
   * For example: `# hello world <br /> nice to see you`
   */
  source: string
  /**
   * An object mapping names to React components.
   * The key used will be the name accessible to MDX.
   *
   * For example: `{ ComponentName: Component }` will be accessible in the MDX as `<ComponentName/>`.
   */
  components?: MDXComponents
  /**
   * Pass-through variables for use in the MDX content
   */
  scope?: Record<string, unknown>
  /**
   * Fallback component for loading
   */
  fallback?: ReactElement
}) {
  const [compiledSource, setCompiledSource] = useState<any>(null)

  useEffect(() => {
    compileMdxClient(source).then(compiledResult => {
      console.log(compiledResult)
      setCompiledSource(compiledResult)
    })
  }, [source])

  const { default: MDXContent } = compiledSource
    ? evaluate(compiledSource.result, scope)
    : { default: null }

  return compiledSource ? (
    <MDXContent components={components} />
  ) : (
    fallback || null
  )
}
