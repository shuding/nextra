import cn from 'clsx'
import type { ReactElement, ReactNode } from 'react'

export function Tree({ children }: { children: ReactNode }): ReactElement {
  return (
    <ul
      className={cn(
        'nextra-filetree _mt-6 _select-none _text-sm _text-gray-800 dark:_text-gray-300',
        '_not-prose', // for nextra-theme-blog
        '_rounded-lg _border _px-4 _py-3 _inline-flex _flex-col _gap-2',
        '_border-neutral-200/70 contrast-more:_border-neutral-400 dark:_border-primary-100/10 contrast-more:dark:_border-neutral-400'
      )}
    >
      {children}
    </ul>
  )
}
