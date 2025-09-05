'use no memo'

import type { ComponentProps } from 'react'
import { File } from './file.js'
import { Folder } from './folder.js'
import { Tree } from './tree.js'

// Workaround to fix
// Error: Cannot access File.propTypes on the server. You cannot dot into a client
// module from a server component. You can only pass the imported name through.
/**
 * A built-in component to visually represent a file tree.
 *
 * @example
 * Click the folder to test the dynamic functionality of the file tree.
 *
 * <FileTree>
 *   <FileTree.Folder name="content" defaultOpen>
 *     <FileTree.File name="_meta.js" />
 *     <FileTree.File name="contact.md" />
 *     <FileTree.File name="index.mdx" />
 *     <FileTree.Folder name="about">
 *       <FileTree.File name="_meta.js" />
 *       <FileTree.File name="legal.md" />
 *       <FileTree.File name="index.mdx" />
 *     </FileTree.Folder>
 *   </FileTree.Folder>
 * </FileTree>
 *
 * @usage
 * Create the file tree structure by nesting `<FileTree.Folder>` and
 * `<FileTree.File>` components within a `<FileTree>`. Name each file or folder
 * with the `name` attribute. Use `defaultOpen` to set the folder to open on load.
 *
 * ```mdx filename="MDX"
 * import { FileTree } from 'nextra/components'
 *
 * <FileTree>
 *   <FileTree.Folder name="content" defaultOpen>
 *     <FileTree.File name="_meta.js" />
 *     <FileTree.File name="contact.md" />
 *     <FileTree.File name="index.mdx" />
 *     <FileTree.Folder name="about">
 *       <FileTree.File name="_meta.js" />
 *       <FileTree.File name="legal.md" />
 *       <FileTree.File name="index.mdx" />
 *     </FileTree.Folder>
 *   </FileTree.Folder>
 * </FileTree>
 * ```
 */
export const FileTree = Object.assign(
  (props: ComponentProps<typeof Tree>) => <Tree {...props} />,
  { Folder, File }
)
