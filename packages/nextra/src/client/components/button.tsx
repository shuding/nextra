import { Button as HeadlessButton } from '@headlessui/react'
import cn from 'clsx'
import type { ComponentPropsWithoutRef, ReactElement } from 'react'

export const classes = {
  border: cn(
    '_border _border-gray-300 dark:_border-neutral-700',
    'contrast-more:_border-gray-900 contrast-more:dark:_border-gray-50'
  )
}

export function Button({
  children,
  className,
  variant = 'outline',
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  variant?: 'outline' | 'default'
}): ReactElement {
  return (
    <HeadlessButton
      className={({ focus }) =>
        cn(
          focus && 'nextra-focusable',
          variant === 'outline' && [classes.border, '_rounded-md _p-1.5'],
          className
        )
      }
      {...props}
    >
      {children}
    </HeadlessButton>
  )
}
