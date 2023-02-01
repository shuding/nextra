import type { FC, ReactElement } from 'react'
import type { AppProps } from 'next/app'
import type { NextraInternalGlobal, PageMapItem } from './types'
import { NEXTRA_INTERNAL } from './constants'

export function setupUnderscoreApp({
  MDXContent,
  pageMap
}: {
  MDXContent: FC
  pageMap: PageMapItem[]
}) {
  const __nextra_internal__ = ((globalThis as NextraInternalGlobal)[
    NEXTRA_INTERNAL
  ] ||= Object.create(null))

  __nextra_internal__.pageMap = pageMap

  return function App({ Component, pageProps }: AppProps): ReactElement {
    return (
      <>
        <MDXContent />
        <Component {...pageProps} />
      </>
    )
  }
}
