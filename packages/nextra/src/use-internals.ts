import { useRouter } from 'next/router'
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
  console.log({ route })
  const context = __nextra_internal__.context[route]

  if (!context) {
    throw new Error(
      'No content found for the current route. This is a Nextra bug.'
    )
  }
  const { pageOpts, Content } = context

  return {
    Layout: __nextra_internal__.Layout,
    themeConfig: __nextra_internal__.themeConfig,
    Content,
    pageOpts
  }
}
