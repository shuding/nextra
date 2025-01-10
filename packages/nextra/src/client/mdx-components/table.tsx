import cn from 'clsx'
import type { ComponentProps, FC } from 'react'

const Table_: FC<ComponentProps<'table'>> = props => (
  <table
    {...props}
    className={cn('x:block x:overflow-x-auto', props.className)}
  />
)
const Th: FC<ComponentProps<'th'>> = props => {
  return (
    <th
      {...props}
      className={cn(
        'x:m-0 x:border x:border-gray-300 x:px-4 x:py-2 x:font-semibold x:dark:border-gray-600',
        props.className
      )}
    />
  )
}
const Tr: FC<ComponentProps<'tr'>> = props => {
  return (
    <tr
      {...props}
      className={cn(
        'x:m-0 x:border-t x:border-gray-300 x:p-0 x:dark:border-gray-600',
        'x:even:bg-gray-100 x:even:dark:bg-gray-600/20',
        props.className
      )}
    />
  )
}
const Td: FC<ComponentProps<'td'>> = props => {
  return (
    <td
      {...props}
      className={cn(
        'x:m-0 x:border x:border-gray-300 x:px-4 x:py-2 x:dark:border-gray-600',
        props.className
      )}
    />
  )
}

export const Table = Object.assign(Table_, {
  Th,
  Tr,
  Td
})
