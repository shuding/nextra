import React, { ComponentProps, ReactElement } from 'react'

export function Ul({
  className,
  ...props
}: ComponentProps<'ul'>): ReactElement {
  return (
    <ul
      className={[
        className !== 'contains-task-list' ? 'ltr:ml-6 rtl:mr-6 list-disc' : '',
        'mt-6 first:mt-0',
        className
      ].join(' ')}
      {...props}
    />
  )
}
