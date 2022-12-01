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
        'nx-border-black/5 nx-bg-black/5 nx-break-words nx-rounded-md nx-border nx-py-0.5 nx-px-[.25em] nx-text-[.9em]',
        'dark:nx-border-white/10 dark:nx-bg-white/10',
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
