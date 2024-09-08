'use client'

import { Button } from '@headlessui/react'
import cn from 'clsx'
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
        cn('_p-2 _transition', hover ? '_opacity-100' : '_opacity-80')
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
