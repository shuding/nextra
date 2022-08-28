import React, { ComponentProps } from 'react'

export const Th = (props: ComponentProps<'th'>) => (
  <th
    className="m-0 border border-gray-300 px-4 py-2 dark:border-gray-600 font-semibold"
    {...props}
  />
)
