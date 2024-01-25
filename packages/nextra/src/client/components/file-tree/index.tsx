import type { ComponentProps } from 'react'
import { File, Folder, Tree } from './file-tree.js'

// Workaround to fix
// Error: Cannot access File.propTypes on the server. You cannot dot into a client module from a
// server component. You can only pass the imported name through.
export const FileTree = Object.assign(
  (props: ComponentProps<typeof Tree>) => <Tree {...props} />,
  { Folder, File }
)
