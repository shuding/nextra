'use client'

import { Button as HeadlessButton } from '@headlessui/react'
import type { ButtonProps as HeadlessButtonProps } from '@headlessui/react'
import cn from 'clsx'
import type { FC } from 'react'
import { classes } from '../mdx-components/pre/index.js'

export type ButtonProps = HeadlessButtonProps & {
  variant?: 'outline' | 'default'
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  return (
    <HeadlessButton
      className={args =>
        cn(
          'x:transition x:cursor-pointer',
          args.focus && 'x:nextra-focus',
          variant === 'outline' && [classes.border, 'x:rounded-md x:p-1.5'],
          typeof className === 'function' ? className(args) : className
        )
      }
      {...props}
    >
      {children}
    </HeadlessButton>
  )
}
