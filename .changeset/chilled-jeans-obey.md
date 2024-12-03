---
'nextra-theme-blog': major
'nextra-theme-docs': major
'nextra': major
---

remove `<Th>`, `<Tr>` and `<Td>` exports (since they should be always used with `<Table>` component)

```diff
- import { Table, Th, Tr, Td } from 'nextra/components'
+ import { Table } from 'nextra/components'

// ...

- <Th>
+ <Table.Th>
- <Tr>
+ <Table.Tr>
- <Td>
+ <Table.Td>
```
