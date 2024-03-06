import { useData } from '../hooks/index.js'
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
  const hydrateFn = Reflect.construct(Function, ['$', ...keys, compiledSource])

  return hydrateFn({ useMDXComponents, ...jsxRuntime }, ...values)
}

export function RemoteContent({
  scope,
  components
}: {
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
}) {
  const compiledSource = useData('__nextra_dynamic_mdx')
  if (!compiledSource) {
    throw new Error(
      'RemoteContent must be used together with the `buildDynamicMDX` API'
    )
  }

  const { default: MDXContent } = evaluate(compiledSource, scope)

  return <MDXContent components={components} />
}

RemoteContent.useTOC = (props: Record<string, unknown>) => {
  const compiledSource = useData('__nextra_dynamic_mdx')
  const { useTOC } = evaluate(compiledSource)
  return useTOC(props)
}
