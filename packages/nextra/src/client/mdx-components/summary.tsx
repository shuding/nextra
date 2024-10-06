import cn from 'clsx'
import type { ComponentProps } from 'react'
import { ArrowRightIcon } from '../icons/index.js'

export function Summary({
  children,
  className,
  ...props
}: ComponentProps<'summary'>) {
  return (
    <summary
      className={cn(
        'focus-visible:nextra-focus',
        '_flex _items-center _cursor-pointer _p-1 _transition-colors hover:_bg-gray-100 dark:hover:_bg-neutral-800',
        // display: flex removes whitespace when `<summary>` contains text with other elements, like `foo <strong>bar</strong>`
        '_whitespace-pre-wrap',
        '_select-none',
        className
      )}
      {...props}
    >
      {children}
      <ArrowRightIcon
        height="16"
        className={cn(
          '_order-first', // if prettier formats `summary` it will have unexpected margin-top
          '_shrink-0 _mx-1.5 motion-reduce:_transition-none',
          'rtl:_rotate-180 [[data-expanded]>summary:first-child>&]:_rotate-90 _transition'
        )}
        strokeWidth="3"
      />
    </summary>
  )
}
