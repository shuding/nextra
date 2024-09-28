import { Button as HeadlessButton } from '@headlessui/react'
import type { ButtonProps } from '@headlessui/react'
import cn from 'clsx'
import type { ReactElement } from 'react'

export const classes = {
  border: cn(
    '_border _border-gray-300 dark:_border-neutral-700',
    'contrast-more:_border-gray-900 contrast-more:dark:_border-gray-50'
  )
}

export function Button({
  children,
  className,
  variant = 'default',
  ...props
}: ButtonProps & {
  variant?: 'outline' | 'default'
}): ReactElement {
  return (
    <HeadlessButton
      className={args =>
        cn(
          '_transition',
          args.focus && 'nextra-focusable',
          variant === 'outline' && [classes.border, '_rounded-md _p-1.5'],
          typeof className === 'function' ? className(args) : className
        )
      }
      {...props}
    >
      {children}
    </HeadlessButton>
  )
}
