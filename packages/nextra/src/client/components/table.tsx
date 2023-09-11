import cn from 'clsx'
import type { ComponentProps } from 'react'

export const Table = ({
  className = '',
  ...props
}: ComponentProps<'table'>) => (
  <table
    className={cn('nx-block nx-overflow-x-scroll', className)}
    {...props}
  />
)
