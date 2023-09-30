/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { useMemo } from 'react'
import type { Components } from '../mdx.js'
import { MDXProvider, useMDXComponents } from '../mdx.js'
import { jsxRuntime } from './jsx-runtime.cjs'

type MDXRemoteProps = {
  /**
   * The compiledSource, generated from next-mdx-remote/serialize
   */
  compiledSource: string
  /**
   * An object mapping names to React components.
   * The key used will be the name accessible to MDX.
   *
   * For example: `{ ComponentName: Component }` will be accessible in the MDX as `<ComponentName/>`.
   */
  components?: Components
}

/**
 * Renders compiled source from next-mdx-remote/serialize.
 */
export function MDXRemote({ compiledSource, components = {} }: MDXRemoteProps) {
  const result = useMemo(() => {
    const hydrateFn = Reflect.construct(Function, [compiledSource])
    return hydrateFn.apply(hydrateFn, [{ useMDXComponents, ...jsxRuntime }])
  }, [compiledSource])

  console.log(33, { result }, result.useTOC())
  // wrapping the content with MDXProvider will allow us to customize the standard
  // markdown components (such as "h1" or "a") with the "components" object
  return (
    <MDXProvider components={components}>
      <result.default />
    </MDXProvider>
  )
}
