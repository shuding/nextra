import { ImageZoom } from 'nextra/components'
import type { FC, ReactNode } from 'react'
import { cloneElement } from 'react'
import { useMDXComponents } from '../mdx-components'

export const Table: FC<{ children: ReactNode }> = ({ children }) => {
  const { table: Table, tr: Tr, th: Th } = useMDXComponents()

  return (
    <Table className="!table w-full text-sm">
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

export function MdxLayout(props) {
  const { table: Table, tr: Tr, th: Th } = useMDXComponents()
  return cloneElement(props.children, {
    components: {
      thead: props => (
        <thead {...props}>
          <Tr>
            <Th align="left">Option</Th>
            <Th align="left">Type</Th>
            <Th align="left">Description</Th>
          </Tr>
        </thead>
      ),
      tbody: props => (
        <tbody
          className="break-words first:[&_td]:font-semibold first:[&_td]:text-violet-600 first:[&_td]:dark:text-violet-500 [&_tr]:!bg-transparent"
          {...props}
        />
      ),
      table: props => <Table className="!table w-full text-sm" {...props} />,
      img: props => (
        <ImageZoom
          {...props}
          className="nextra-border rounded-xl border drop-shadow-sm"
        />
      )
    }
  })
}
