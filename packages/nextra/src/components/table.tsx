import type { ComponentProps } from 'react'

export const Table = ({
  className = '',
  ...props
}: ComponentProps<'table'>) => (
  <table className={'nx-block nx-overflow-x-scroll ' + className} {...props} />
)
