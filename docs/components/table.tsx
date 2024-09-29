import { FC, ReactNode } from 'react'

export const Table: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <table className="w-full !table text-sm">
      <thead>
        <tr>
          <th align="left">Option</th>
          <th align="left">Type</th>
          <th align="left">Description</th>
        </tr>
      </thead>
      <tbody className="break-words first:[&_td]:font-semibold first:[&_td]:text-violet-600 first:[&_td]:dark:text-violet-500 [&_tr]:!bg-transparent">
        {(children as any).props.children[1].props.children}
      </tbody>
    </table>
  )
}
