import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

const {
  tr: Tr,
  th: Th,
  table: Table,
  ...docsComponents
} = getDocsMDXComponents()

export const useMDXComponents: typeof getDocsMDXComponents = components => ({
  ...docsComponents,
  tr: Tr,
  th: Th,
  thead: ({ children, ...props }) => (
    <thead {...props}>
      {children.props.children[0].props.children ? (
        children
      ) : (
        <Tr>
          <Th align="left">Option</Th>
          <Th align="left">Type</Th>
          <Th align="left">Description</Th>
        </Tr>
      )}
    </thead>
  ),
  tbody: props => (
    <tbody
      className="break-words first:[&_td]:font-semibold first:[&_td]:text-violet-600 first:[&_td]:dark:text-violet-500 [&_tr]:!bg-transparent"
      {...props}
    />
  ),
  table: props => <Table className="!table w-full text-sm" {...props} />,
  ...components
})
