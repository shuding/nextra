import cn from 'clsx'
import { FC, ReactNode } from 'react'

export const Screenshot: FC<{ children: ReactNode; full?: boolean }> = ({
  full,
  children
}) => {
  return (
    <div
      className={cn(
        '-mb-4 mt-6 flex justify-center overflow-hidden rounded-xl border dark:border-zinc-800',
        full ? 'bg-white' : 'bg-zinc-100',
        '*:w-auto *:select-none *:bg-white',
        !full && '*:ring-1 *:ring-gray-200'
      )}
    >
      {children}
    </div>
  )
}
