import cn from 'clsx'
import type { ComponentProps } from 'react'

export const Table = ({ className, ...props }: ComponentProps<'table'>) => (
  <table
    className={cn(
      '_not-prose', // for nextra-theme-blog
      '_block _overflow-x-auto',
      className
    )}
    {...props}
  />
)
