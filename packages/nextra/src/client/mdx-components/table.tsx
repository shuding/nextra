import cn from 'clsx'
import type { FC, HTMLAttributes } from 'react'

const Table_: FC<HTMLAttributes<HTMLTableElement>> = props => (
  <table
    {...props}
    className={cn('x:block x:overflow-x-auto', props.className)}
  />
)
const Th: FC<HTMLAttributes<HTMLTableCellElement>> = props => {
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
const Tr: FC<HTMLAttributes<HTMLTableRowElement>> = props => {
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
const Td: FC<HTMLAttributes<HTMLTableCellElement>> = props => {
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

/**
 * A collection of built-in components designed to create styled, non-markdown
 * (i.e., literal) HTML tables.
 *
 * @example
 * <Table className="mt-6">
 *   <thead>
 *     <Table.Tr>
 *       <Table.Th>Country</Table.Th>
 *       <Table.Th>Flag</Table.Th>
 *     </Table.Tr>
 *   </thead>
 *   <tbody>
 *     <Table.Tr>
 *       <Table.Td>France</Table.Td>
 *       <Table.Td>🇫🇷</Table.Td>
 *     </Table.Tr>
 *     <Table.Tr>
 *       <Table.Td>Ukraine</Table.Td>
 *       <Table.Td>🇺🇦</Table.Td>
 *     </Table.Tr>
 *   </tbody>
 * </Table>
 *
 * @usage
 * ```mdx
 * import { Table } from 'nextra/components'
 *
 * <Table>
 *   <thead>
 *     <Table.Tr>
 *       <Table.Th>Country</Table.Th>
 *       <Table.Th>Flag</Table.Th>
 *     </Table.Tr>
 *   </thead>
 *   <tbody>
 *     <Table.Tr>
 *       <Table.Td>France</Table.Td>
 *       <Table.Td>🇫🇷</Table.Td>
 *     </Table.Tr>
 *     <Table.Tr>
 *       <Table.Td>Ukraine</Table.Td>
 *       <Table.Td>🇺🇦</Table.Td>
 *     </Table.Tr>
 *   </tbody>
 * </Table>
 * ```
 */
export const Table = Object.assign(Table_, {
  Th,
  Tr,
  Td
})
