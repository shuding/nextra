import React, { ComponentProps } from 'react'

export const Tr = (props: ComponentProps<'tr'>) => (
  <tr
    className={
      'm-0 border-t border-gray-300 p-0 dark:border-gray-600 ' +
      'even:bg-gray-100 even:dark:bg-gray-600/20'
    }
    {...props}
  />
)
