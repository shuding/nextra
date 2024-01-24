import cn from 'clsx'
import type { ComponentProps } from 'react'

export function H1({ children, className, ...props }: ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        '_mt-2 _text-4xl _font-bold _tracking-tight _text-slate-900 dark:_text-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}
