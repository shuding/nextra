import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { PageMapItem, PageOpts } from '../types'

const NEXTRA_INTERNAL = Symbol.for('__nextra_internal__')

export function usePageContext() {
  const __nextra_internal__ = (globalThis as any)[NEXTRA_INTERNAL] as {
    pageMap: PageMapItem[]
    route: string
    context: {
      Content: React.FC
      pageOpts: PageOpts
      themeConfig: any | null
    }
    refreshListeners: Record<string, (() => void)[]>
  }

  const rerender = useState({})[1]
  const { route } = useRouter()

  // TODO: Remove the HMR logic for prod builds
  useEffect(() => {
    const trigger = () => rerender({})

    const listeners = __nextra_internal__.refreshListeners

    if (!listeners[route]) listeners[route] = []
    listeners[route].push(trigger)

    return () => {
      listeners[route].splice(listeners[route].indexOf(trigger), 1)
    }
  }, [route])

  return __nextra_internal__.context
}
