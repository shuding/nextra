import cn from 'clsx'
import type { FC, ReactNode } from 'react'

export const Screenshot: FC<{ children: ReactNode; full?: boolean }> = ({
  full,
  children
}) => {
  return (
    <div
      className={cn(
        'mt-6 -mb-4 flex justify-center overflow-hidden rounded-xl border dark:border-zinc-800',
        full ? 'bg-white' : 'bg-zinc-100',
        '*:w-auto *:bg-white *:select-none',
        !full && '*:ring-1 *:ring-gray-200'
      )}
    >
      {children}
    </div>
  )
}
