import React, { ComponentProps, ReactElement } from 'react'

export const Code = ({
  children,
  className = '',
  ...props
}: ComponentProps<'code'>): ReactElement => {
  const hasLineNumbers = 'data-line-numbers' in props
  return (
    <code
      className={[
        'border-black/5 bg-black/5 break-words rounded-md border py-0.5 px-[.25em] text-[.9em]',
        'dark:border-white/10 dark:bg-white/10',
        hasLineNumbers ? '[counter-reset:line]' : '',
        className
      ].join(' ')}
      // always show code blocks in ltr
      dir="ltr"
      {...props}
    >
      {children}
    </code>
  )
}
