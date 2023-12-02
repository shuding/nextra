import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'

export function Code({
  children,
  className,
  'data-language': _language,
  ...props
}: ComponentProps<'code'> & {
  'data-language'?: string
}): ReactElement {
  return (
    <code
      className={cn(
        'nextra-code',
        'data-line-numbers' in props && '[counter-reset:line]',
        className
      )}
      // always show code blocks in ltr
      dir="ltr"
      {...props}
    >
      {children}
    </code>
  )
}
