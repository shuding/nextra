import type { FC, ReactNode } from 'react'
import { useMDXComponents } from '../mdx-components'

export const Table: FC<{ children: ReactNode }> = ({ children }) => {
  const { table, tr, th } = useMDXComponents()

  // TODO: fixme
  const Table = table!
  const Tr = tr!
  const Th = th!

  return (
    <Table className="w-full !table text-sm">
      <thead>
        <Tr>
          <Th align="left">Option</Th>
          <Th align="left">Type</Th>
          <Th align="left">Description</Th>
        </Tr>
      </thead>
      <tbody className="break-words first:[&_td]:font-semibold first:[&_td]:text-violet-600 first:[&_td]:dark:text-violet-500 [&_tr]:!bg-transparent">
        {(children as any).props.children[1].props.children}
      </tbody>
    </Table>
  )
}
