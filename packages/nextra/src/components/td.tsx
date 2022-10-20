import React, { ComponentProps } from 'react'

export const Td = (props: ComponentProps<'td'>) => (
  <td
    className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 dark:nx-border-gray-600"
    {...props}
  />
)
