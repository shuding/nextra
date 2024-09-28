import cn from 'clsx'
import type { ComponentProps } from 'react'

export const Td = ({ className = '', ...props }: ComponentProps<'td'>) => (
  <td
    className={cn(
      '_m-0 _border _border-gray-300 _px-4 _py-2 dark:_border-gray-600',
      className
    )}
    {...props}
  />
)
