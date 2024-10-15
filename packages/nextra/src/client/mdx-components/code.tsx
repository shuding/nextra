import cn from 'clsx'
import type { ComponentProps, FC } from 'react'

export const Code: FC<
  ComponentProps<'code'> & {
    'data-language'?: string
  }
> = ({ children, className, 'data-language': _language, ...props }) => {
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
