import cn from 'clsx'
import type { ComponentProps } from 'react'

export const Tr = ({ className = '', ...props }: ComponentProps<'tr'>) => (
  <tr
    className={cn(
      '_m-0 _border-t _border-gray-300 _p-0 dark:_border-gray-600',
      'even:_bg-gray-100 even:dark:_bg-gray-600/20',
      className
    )}
    {...props}
  />
)
