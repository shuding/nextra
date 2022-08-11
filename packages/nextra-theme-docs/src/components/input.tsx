import React, { ComponentProps, forwardRef } from 'react'
import cn from 'clsx'

type InputProps = ComponentProps<'input'> & { show?: boolean }

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, show, ...props }, forwardedRef) => (
    <div className="relative flex items-center">
      <input
        ref={forwardedRef}
        spellCheck={false}
        className={cn(
          className,
          'block w-full appearance-none rounded-lg px-3 py-2 leading-tight transition-colors',
          'focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-200',
          'dark:focus:bg-dark dark:focus:ring-gray-100/20',
          'bg-black/[.03] text-gray-900 md:text-sm text-base',
          'dark:bg-gray-50/10 dark:text-gray-300 dark:border-gray-800',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500'
        )}
        {...props}
      />
      {!show && (
        <div className="pointer-events-none absolute inset-y-0 ltr:right-0 rtl:left-0 hidden select-none p-1.5 sm:flex">
          <kbd
            className={cn(
              'inline-flex items-center rounded border bg-white px-1.5 font-mono text-sm font-medium text-gray-400',
              'dark:border-gray-100/20 dark:bg-dark/50 dark:text-gray-500'
            )}
          >
            /
          </kbd>
        </div>
      )}
    </div>
  )
)
