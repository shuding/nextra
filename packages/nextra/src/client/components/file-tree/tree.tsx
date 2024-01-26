import type { ReactElement, ReactNode } from 'react'
import cn from 'clsx'

export function Tree({ children }: { children: ReactNode }): ReactElement {
  return (
    <div
      className={cn(
        'nextra-filetree _mt-6 _select-none _text-sm _text-gray-800 dark:_text-gray-300',
        '_not-prose' // for nextra-theme-blog
      )}
    >
      <div className="_inline-block _rounded-lg _border _px-4 _py-2 dark:_border-neutral-800">
        {children}
      </div>
    </div>
  )
}
