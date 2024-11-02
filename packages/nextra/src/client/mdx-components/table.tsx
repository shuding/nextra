import cn from 'clsx'
import type { ComponentProps, FC } from 'react'

const _Table: FC<ComponentProps<'table'>> = props => (
  <table
    {...props}
    className={cn(
      '_not-prose', // for nextra-theme-blog
      '_block _overflow-x-auto',
      props.className
    )}
  />
)
const Th: FC<ComponentProps<'th'>> = props => (
  <th
    {...props}
    className={cn(
      '_m-0 _border _border-gray-300 _px-4 _py-2 _font-semibold dark:_border-gray-600',
      props.className
    )}
  />
)
const Tr: FC<ComponentProps<'tr'>> = props => (
  <tr
    {...props}
    className={cn(
      '_m-0 _border-t _border-gray-300 _p-0 dark:_border-gray-600',
      'even:_bg-gray-100 even:dark:_bg-gray-600/20',
      props.className
    )}
  />
)
const Td: FC<ComponentProps<'td'>> = props => (
  <td
    {...props}
    className={cn(
      '_m-0 _border _border-gray-300 _px-4 _py-2 dark:_border-gray-600',
      props.className
    )}
  />
)

export const Table = Object.assign(_Table, {
  Th,
  Tr,
  Td
})
