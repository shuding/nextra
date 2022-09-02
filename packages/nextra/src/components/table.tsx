import React, { ComponentProps } from 'react'

export const Table = ({
  className = '',
  ...props
}: ComponentProps<'table'>) => (
  <table className={'block overflow-x-scroll ' + className} {...props} />
)
