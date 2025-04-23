import cn from 'clsx'
import type { FC, HTMLAttributes } from 'react'

export const Code: FC<
  HTMLAttributes<HTMLElement> & {
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
