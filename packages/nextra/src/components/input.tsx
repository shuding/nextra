import React, { ComponentProps, ReactElement } from 'react'

export function Input(props: ComponentProps<'input'>): ReactElement {
  return (
    <input
      className={props.type === 'checkbox' ? 'ltr:mr-1 rtl:ml-1' : ''}
      {...props}
    />
  )
}
