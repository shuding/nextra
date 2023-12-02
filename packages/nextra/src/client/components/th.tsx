import cn from 'clsx'
import type { ComponentProps } from 'react'

export const Th = ({ className = '', ...props }: ComponentProps<'th'>) => (
  <th
    className={cn(
      '_m-0 _border _border-gray-300 _px-4 _py-2 _font-semibold dark:_border-gray-600',
      className
    )}
    {...props}
  />
)
