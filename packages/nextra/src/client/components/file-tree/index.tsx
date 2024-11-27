'use no memo'

import type { ComponentProps } from 'react'
import { File } from './file.js'
import { Folder } from './folder.js'
import { Tree } from './tree.js'

// Workaround to fix
// Error: Cannot access File.propTypes on the server. You cannot dot into a client
// module from a server component. You can only pass the imported name through.
export const FileTree = Object.assign(
  (props: ComponentProps<typeof Tree>) => <Tree {...props} />,
  { Folder, File }
)
