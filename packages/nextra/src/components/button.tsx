import React, { ComponentProps, ReactElement } from 'react'

export const Button = ({
  children,
  className = '',
  ...props
}: ComponentProps<'button'>): ReactElement => {
  return (
    <button
      className={[
        'nextra-button',
        'bg-primary-700/5 border border-black/5 text-gray-600 hover:text-gray-900 rounded-md p-2',
        'dark:bg-primary-300/10 dark:border-white/10 dark:text-gray-400 dark:hover:text-gray-50',
        className
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
