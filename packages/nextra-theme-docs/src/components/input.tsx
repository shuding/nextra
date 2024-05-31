import cn from 'clsx'
import type { ComponentProps, ReactNode } from 'react'
import { forwardRef } from 'react'

type InputProps = ComponentProps<'input'> & { suffix?: ReactNode }

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, ...props }, forwardedRef) => (
    <div className="_relative _flex _items-center _text-gray-900 contrast-more:_text-gray-800 dark:_text-gray-300 contrast-more:dark:_text-gray-300">
      <input
        ref={forwardedRef}
        spellCheck={false}
        className={cn(
          className,
          '_w-full _appearance-none _rounded-lg _px-3 _py-2 _transition-colors',
          '_text-base _leading-tight md:_text-sm',
          '_bg-black/[.05] dark:_bg-gray-50/10',
          'focus:!_bg-transparent',
          'placeholder:_text-gray-500 dark:placeholder:_text-gray-400',
          'contrast-more:_border contrast-more:_border-current'
        )}
        {...props}
      />
      {suffix}
    </div>
  )
)

Input.displayName = 'Input'
