import React, { ComponentProps } from 'react'

export const Td = (props: ComponentProps<'td'>) => (
  <td
    className="m-0 border border-gray-300 px-4 py-2 dark:border-gray-600"
    {...props}
  />
)
