import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'

export const Button = ({
  children,
  className,
  ...props
}: ComponentProps<'button'>): ReactElement => {
  return (
    <button
      className={cn(
        'nextra-button _transition-all active:_opacity-50',
        '_bg-primary-700/5 _border _border-black/5 _text-gray-600 hover:_text-gray-900 _rounded-md _p-1.5',
        'dark:_bg-primary-300/10 dark:_border-white/10 dark:_text-gray-400 dark:hover:_text-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
