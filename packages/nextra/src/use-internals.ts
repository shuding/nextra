import { useRouter } from 'next/router.js'
import { useEffect, useState } from 'react'

import { IS_PRODUCTION, NEXTRA_INTERNAL } from './constants'
import { NextraInternalGlobal } from './types'

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

  useEffect(() => {
    if (IS_PRODUCTION) return
    const trigger = () => rerender({})

    const listeners = __nextra_internal__.refreshListeners

    listeners[route] ||= []
    listeners[route].push(trigger)

    return () => {
      listeners[route].splice(listeners[route].indexOf(trigger), 1)
    }
  }, [route])

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
