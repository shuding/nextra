import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'

export function Steps({
  children,
  className,
  ...props
}: ComponentProps<'div'>): ReactElement {
  return (
    <div
      className={cn(
        'nextra-steps _ml-4 _mb-12 _border-l _border-gray-200 _pl-6',
        'dark:_border-neutral-800 [counter-reset:step]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
