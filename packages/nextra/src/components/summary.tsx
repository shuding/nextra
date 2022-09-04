import React, { ComponentProps, ReactElement } from 'react'
import { useDetails } from '../hooks'
import { ArrowRightIcon } from '../icons'

export const Summary = ({
  variant = 'default',
  className = '',
  children,
  iconProps = {},
  ...props
}: ComponentProps<'summary'> & {
  variant?: 'default' | 'raw'
  iconProps?: ComponentProps<typeof ArrowRightIcon>
}): ReactElement => {
  const setOpen = useDetails()

  return (
    <summary
      className={[
        variant === 'default'
          ? 'p-1 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800'
          : '',
        'cursor-pointer list-none flex items-center',
        '[&::-webkit-details-marker]:hidden',
        className
      ].join(' ')}
      {...props}
      onClick={e => {
        e.preventDefault()
        setOpen(v => !v)
      }}
    >
      <ArrowRightIcon
        {...iconProps}
        className={[
          'h-[1.2em] w-[1.2em] p-0.5 shrink-0',
          iconProps.className || ''
        ].join(' ')}
        pathClassName={[
          'origin-center transition-transform stroke-[3px] rtl:-rotate-180',
          'ltr:[[open]>summary>svg>&]:rotate-90',
          'rtl:[[open]>summary>svg>&]:rotate-[-270deg]',
          iconProps.pathClassName || ''
        ].join(' ')}
      />
      {children}
    </summary>
  )
}
