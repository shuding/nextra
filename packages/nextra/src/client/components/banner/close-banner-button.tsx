'use client'

import cn from 'clsx'
import { Button } from '../button.js'
import type { ReactElement, ReactNode } from 'react'

export function CloseBannerButton({
  storageKey,
  children
}: {
  storageKey: string
  children: ReactNode
}): ReactElement {
  return (
    <Button
      aria-label="Dismiss banner"
      className={({ hover }) =>
        cn('_p-2', hover ? '_opacity-100' : '_opacity-80')
      }
      onClick={() => {
        try {
          localStorage.setItem(storageKey, '1')
        } catch {
          /* ignore */
        }
        document.body.classList.add('nextra-banner-hidden')
      }}
    >
      {children}
    </Button>
  )
}
