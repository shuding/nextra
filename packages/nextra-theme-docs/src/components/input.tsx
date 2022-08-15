import React, { ComponentProps, forwardRef, ReactNode } from 'react'
import cn from 'clsx'

type InputProps = ComponentProps<'input'> & { suffix?: ReactNode }

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, ...props }, forwardedRef) => (
    <div className="relative flex items-center text-gray-900 dark:text-gray-300 contrast-more:text-gray-800 contrast-more:dark:text-gray-300">
      <input
        ref={forwardedRef}
        spellCheck={false}
        className={cn(
          className,
          'block w-full appearance-none rounded-lg px-3 py-2 transition-colors',
          'md:text-sm text-base leading-tight',
          'bg-black/[.03] dark:bg-gray-50/10',
          'focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-200',
          'dark:focus:bg-dark dark:focus:ring-gray-100/20',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'contrast-more:border contrast-more:border-current'
        )}
        {...props}
      />
      {suffix}
    </div>
  )
)
