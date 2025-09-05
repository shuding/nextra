'use no memo'

import jsxDevRuntime from 'react/jsx-dev-runtime'
import jsxRuntime from 'react/jsx-runtime'
import type { EvaluateResult } from '../types.js'
import type { MDXComponents } from './mdx-components.js'

const runtime =
  process.env.NODE_ENV === 'production' ? jsxRuntime : jsxDevRuntime

export type Scope = Record<string, unknown>

export function evaluate(
  rawJs: string,
  /** @default {} */
  components: MDXComponents = {},
  /** @default {} */
  scope: Scope = {}
): EvaluateResult {
  // If we're ready to render, we can assemble the component tree and let React do its thing
  // first we set up the scope which has to include the mdx custom
  // create element function as well as any components we're using
  const keys = Object.keys(scope)
  const values = Object.values(scope)
  // Now we eval the source code using a function constructor
  // in order for this to work, we need to have React, the mdx `createElement`,
  // and all our components in scope for the function, which is the case here
  // we pass the names (via keys) in as the function's args, and execute the
  // function with the actual values.
  const hydrateFn = Reflect.construct(Function, ['$', ...keys, rawJs])

  return hydrateFn(
    {
      ...runtime,
      // Inject components in `<MDXContent>` and TOC
      useMDXComponents: () => components
    },
    ...values
  )
}
