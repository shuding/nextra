import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'

export const classes = {
  border: cn(
    '_border _border-gray-300 dark:_border-neutral-700',
    'contrast-more:_border-gray-900 contrast-more:dark:_border-gray-50'
  )
}

export function Button({
  children,
  className,
  ...props
}: ComponentProps<'button'>): ReactElement {
  return (
    <button
      className={cn(
        '_transition _rounded-md _p-1.5',
        classes.border,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
