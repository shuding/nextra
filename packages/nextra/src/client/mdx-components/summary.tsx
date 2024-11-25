import cn from 'clsx'
import type { ComponentProps, FC } from 'react'
import { ArrowRightIcon } from '../icons/index.js'

export const Summary: FC<ComponentProps<'summary'>> = ({
  children,
  className,
  ...props
}) => (
  <summary
    className={cn(
      'x:focus-visible:nextra-focus',
      'x:flex x:items-center x:cursor-pointer x:p-1 x:transition-colors x:hover:bg-gray-100 x:dark:hover:bg-neutral-800',
      'x:[&::-webkit-details-marker]:hidden', // Safari
      // display: flex removes whitespace when `<summary>` contains text with other elements, like `foo <strong>bar</strong>`
      'x:whitespace-pre-wrap',
      'x:select-none x:rounded',
      className
    )}
    {...props}
  >
    {children}
    <ArrowRightIcon
      height="16"
      className={cn(
        'x:order-first', // if prettier formats `summary` it will have unexpected margin-top
        'x:shrink-0 x:mx-1.5 x:motion-reduce:transition-none',
        'x:rtl:rotate-180 x:[[data-expanded]>summary:first-child>&]:rotate-90 x:transition'
      )}
      strokeWidth="3"
    />
  </summary>
)
