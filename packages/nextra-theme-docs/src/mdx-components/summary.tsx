import cn from 'clsx'
import { ArrowRightIcon } from 'nextra/icons'
import type { ComponentProps, ReactElement } from 'react'

export function Summary({
  children,
  ...props
}: ComponentProps<'summary'>): ReactElement {
  return (
    <summary
      className={cn(
        '_flex _items-center _cursor-pointer _p-1 _transition-colors hover:_bg-gray-100 dark:hover:_bg-neutral-800',
        // display: flex removes whitespace when `<summary />` contains text with other elements, like `foo <strong>bar</strong>`
        '_whitespace-pre-wrap'
      )}
      {...props}
    >
      {children}
      <ArrowRightIcon
        className={cn(
          '_order-first', // if prettier formats `summary` it will have unexpected margin-top
          '_size-4 _shrink-0 _mx-1.5',
          'rtl:_rotate-180 [[data-expanded]>summary>&]:_rotate-90 _transition'
        )}
        pathClassName="_stroke-[3px]"
      />
    </summary>
  )
}
