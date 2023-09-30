import React, { useState, useEffect, useMemo } from 'react'
import { jsxRuntime } from './jsx-runtime.cjs'
import * as mdx from '@mdx-js/react'
/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

if (typeof window !== 'undefined') {
  window.requestIdleCallback =
    window.requestIdleCallback ||
    function(cb) {
      var start = Date.now()
      return setTimeout(function() {
        cb({
          didTimeout: false,
          timeRemaining: function() {
            return Math.max(0, 50 - (Date.now() - start))
          }
        })
      }, 1)
    }

  window.cancelIdleCallback =
    window.cancelIdleCallback ||
    function(id) {
      clearTimeout(id)
    }
}

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
/**
 * Renders compiled source from next-mdx-remote/serialize.
 */
// @ts-expect-error
function MDXRemote({ compiledSource, frontmatter, scope, components = {}, lazy }) {
  const [isReadyToRender, setIsReadyToRender] = useState(!lazy || typeof window === 'undefined')
  // if we're on the client side and `lazy` is set to true, we hydrate the
  // mdx content inside requestIdleCallback, allowing the page to get to
  // interactive quicker, but the mdx content to hydrate slower.
  useEffect(() => {
    if (lazy) {
      const handle = window.requestIdleCallback(() => {
        setIsReadyToRender(true)
      })
      return () => window.cancelIdleCallback(handle)
    }
  }, [])
  const Content = useMemo(() => {
    // if we're ready to render, we can assemble the component tree and let React do its thing
    // first we set up the scope which has to include the mdx custom
    // create element function as well as any components we're using
    const fullScope = Object.assign({ opts: { ...mdx, ...jsxRuntime } }, { frontmatter }, scope)
    const keys = Object.keys(fullScope)
    const values = Object.values(fullScope)
    // now we eval the source code using a function constructor
    // in order for this to work we need to have React, the mdx createElement,
    // and all our components in scope for the function, which is the case here
    // we pass the names (via keys) in as the function's args, and execute the
    // function with the actual values.
    const hydrateFn = Reflect.construct(Function, keys.concat(`${compiledSource}`))
    const result = hydrateFn.apply(hydrateFn, values)
    console.log(99999, { result }, result.useTOC())
    return result.default
  }, [scope, compiledSource])
  if (!isReadyToRender) {
    // If we're not ready to render, return an empty div to preserve SSR'd markup
    return (React.createElement('div', { dangerouslySetInnerHTML: { __html: '' }, suppressHydrationWarning: true }))
  }
  // wrapping the content with MDXProvider will allow us to customize the standard
  // markdown components (such as "h1" or "a") with the "components" object
  const content = (React.createElement(mdx.MDXProvider, { components: components },
    React.createElement(Content, null)))
  // If lazy = true, we need to render a wrapping div to preserve the same markup structure that was SSR'd
  console.log({ content, compiledSource })
  return lazy ? React.createElement('div', null, content) : content
}

export { MDXRemote }
