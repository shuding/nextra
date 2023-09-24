import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'

export function Button({
  children,
  className,
  ...props
}: ComponentProps<'button'>): ReactElement {
  return (
    <button
      className={cn(
        'nextra-button _transition active:_opacity-50',
        '_border _border-gray-300 hover:_text-gray-900 _rounded-md _p-1.5',
        'dark:_border-neutral-700 dark:hover:_text-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
