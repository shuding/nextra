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
        cn('_p-2', hover ? '_opacity-100' : '_opacity-80')
      }
      onClick={event => {
        event.currentTarget.parentElement!.classList.add('_hidden')
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
