import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { NEXTRA_INTERNAL } from './constants'
import type { NextraInternalGlobal } from './types'

/**
 * This hook is used to access the internal state of Nextra, you should never
 * use this hook in your application.
 */
export function useInternals() {
  const __nextra_internal__ = (globalThis as NextraInternalGlobal)[
    NEXTRA_INTERNAL
  ]
  const { route } = useRouter()
  const rerender = useState({})[1]

  // The HMR handling logic is not needed for production builds, the condition
  // should be removed after compilation, and it's fine to put the effect under
  // if, because hooks' order is still stable.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const trigger = () => rerender({})

      const listeners = __nextra_internal__.refreshListeners

      listeners[route] ||= []
      listeners[route].push(trigger)

      return () => {
        listeners[route].splice(listeners[route].indexOf(trigger), 1)
      }
    }, [route, __nextra_internal__.refreshListeners, rerender])
  }

  const context = __nextra_internal__.context[route]

  if (!context) {
    throw new Error(
      `No content found for the current route. This is a Nextra bug.`
    )
  }

  return {
    context,
    Layout: __nextra_internal__.Layout
  }
}
