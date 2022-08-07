import React, { ReactElement, ReactNode } from 'react'
import cn from 'clsx'

export function Bleed({
  full,
  children
}: {
  full: boolean
  children: ReactNode
}): ReactElement {
  return (
    <div
      className={cn('bleed relative -mx-6 mt-6 md:-mx-8 2xl:-mx-24', { full })}
    >
      {children}
    </div>
  )
}
