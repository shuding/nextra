import type { ComponentProps } from 'react'
import { File, Folder, Tree } from './file-tree/index.js'
import { Tabs as _Tabs, Tab } from './tabs.js'

export { Button } from './button.js'
export { Callout } from './callout.js'
export { Cards } from './cards.js'
export { Code } from './code.js'
export { CopyToClipboard } from './copy-to-clipboard.js'

export { Pre } from './pre.js'
export { RemoteContent } from './remote-content.js'
export { Steps } from './steps.js'
export { Table } from './table.js'
export { Td } from './td.js'
export { Th } from './th.js'
export { Tr } from './tr.js'
export { Mermaid } from '@theguild/remark-mermaid/mermaid'
export { MathJax, MathJaxContext } from './mathjax.js'
export { withIcons } from './with-icons.js'

// Workaround to fix
// Error: Cannot access Tab.propTypes on the server. You cannot dot into a client module from a
// server component. You can only pass the imported name through.
export const Tabs = Object.assign(
  (props: ComponentProps<typeof _Tabs>) => <_Tabs {...props} />,
  { Tab }
)

// Workaround to fix
// Error: Cannot access File.propTypes on the server. You cannot dot into a client module from a
// server component. You can only pass the imported name through.
export const FileTree = Object.assign(
  (props: ComponentProps<typeof Tree>) => <Tree {...props} />,
  { Folder, File }
)
