import React, { ComponentProps, ReactElement } from 'react'

export const Code = ({
  children,
  ...props
}: ComponentProps<'code'>): ReactElement => {
  return (
    // always show code blocks in ltr
    <code dir="ltr" {...props}>
      {children}
    </code>
  )
}
