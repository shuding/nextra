import cn from 'clsx'
import type { ComponentProps } from 'react'

export const Td = ({ className = '', ...props }: ComponentProps<'td'>) => (
  <td
    className={cn(
      'nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 dark:nx-border-gray-600',
      className
    )}
    {...props}
  />
)
