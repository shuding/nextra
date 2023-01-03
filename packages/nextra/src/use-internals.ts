import { useRouter } from 'next/router.js'
import { useEffect, useState } from 'react'

import { PageMapItem, PageOpts } from './types'
import { IS_PRODUCTION } from './constants'

const NEXTRA_INTERNAL = Symbol.for('__nextra_internal__')

/**
 * This hook is used to access the internal state of Nextra, you should never
 * use this hook in your application.
 */
export function useInternals() {
  const __nextra_internal__ = (globalThis as any)[NEXTRA_INTERNAL] as {
    pageMap: PageMapItem[]
    route: string
    context: Record<
      string,
      {
        Content: React.FC
        pageOpts: PageOpts
        themeConfig: any | null
      }
    >
    refreshListeners: Record<string, (() => void)[]>
    Layout: React.FC<any>
  }

  const { route } = useRouter()

  if (!IS_PRODUCTION) {
    const rerender = useState({})[1]
    useEffect(() => {
      const trigger = () => rerender({})

      const listeners = __nextra_internal__.refreshListeners

      listeners[route] ||= []
      listeners[route].push(trigger)

      return () => {
        listeners[route].splice(listeners[route].indexOf(trigger), 1)
      }
    }, [route])
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
