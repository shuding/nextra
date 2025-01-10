'use client'

import cn from 'clsx'
import type { FC, ReactNode } from 'react'
import { Button } from '../button.js'

export const CloseBannerButton: FC<{
  storageKey: string
  children: ReactNode
}> = ({ storageKey, children }) => {
  return (
    <Button
      aria-label="Dismiss banner"
      className={({ hover }) =>
        cn('x:p-2', hover ? 'x:opacity-100' : 'x:opacity-80')
      }
      onClick={event => {
        event.currentTarget.parentElement!.classList.add('x:hidden')
        try {
          localStorage.setItem(storageKey, '1')
        } catch {
          /* ignore */
        }
      }}
    >
      {children}
    </Button>
  )
}
