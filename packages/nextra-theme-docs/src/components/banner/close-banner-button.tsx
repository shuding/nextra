'use client'

import type { ReactElement, ReactNode } from 'react'

export function CloseBannerButton({
  storageKey,
  children
}: {
  storageKey: string
  children: ReactNode
}): ReactElement {
  return (
    <button
      type="button"
      aria-label="Dismiss banner"
      className="_w-8 _h-8 _opacity-80 hover:_opacity-100"
      onClick={() => {
        try {
          localStorage.setItem(storageKey, '0')
        } catch {
          /* ignore */
        }
        document.body.classList.add('nextra-banner-hidden')
      }}
    >
      {children}
    </button>
  )
}
