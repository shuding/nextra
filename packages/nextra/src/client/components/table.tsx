import cn from 'clsx'
import type { ComponentProps } from 'react'

export const Table = ({
  className = '',
  ...props
}: ComponentProps<'table'>) => (
  <table className={cn('_block _overflow-x-scroll', className)} {...props} />
)
