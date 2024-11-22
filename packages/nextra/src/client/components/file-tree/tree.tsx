import cn from 'clsx'
import type { FC, ReactNode } from 'react'

export const Tree: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ul
      className={cn(
        'nextra-filetree x:mt-6 x:select-none x:text-sm x:text-gray-800 x:dark:text-gray-300',
        'x:not-prose', // for nextra-theme-blog
        'x:rounded-lg x:border x:px-4 x:py-3 x:inline-flex x:flex-col x:gap-2',
        'x:border-neutral-200/70 x:contrast-more:border-neutral-400 x:dark:border-primary-100/10 x:contrast-more:dark:border-neutral-400'
      )}
    >
      {children}
    </ul>
  )
}
