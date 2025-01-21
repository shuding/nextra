import path from 'node:path'
import { FileTree } from 'nextra/components'
import type { FC, ReactNode } from 'react'
import { Children } from 'react'
import { useMDXComponents } from '../mdx-components'

function mapChildren(children) {
  return Children.map(children, child => {
    const { name, ext } = path.parse(child.props.name)
    if (name === '_meta') {
      return child
    }
    if (ext === '.md' || ext === '.mdx') {
      const file = <FileTree.File name={`page${ext}`} />
      if (name === 'index') {
        return file
      }
      return <FileTree.Folder name={name}>{file}</FileTree.Folder>
    }
    if (!ext) {
      return (
        <FileTree.Folder {...child.props}>
          {mapChildren(child.props.children)}
        </FileTree.Folder>
      )
    }
    return child
  }).sort((a, b) => {
    const aName = a.props.name
    const bName = b.props.name
    const isAFolder = a.props.children
    const isBFolder = b.props.children
    if (isAFolder && !isBFolder) return -1
    if (isBFolder && !isAFolder) return 1
    return aName.localeCompare(bName)
  })
}

export const ContentAndAppFileTee: FC<{ children: ReactNode }> = ({
  children
}) => {
  const { a: Link, code: Code } = useMDXComponents()
  const layout = <FileTree.File name="layout.jsx" />
  return (
    <>
      <FileTree>
        <b>
          Using{' '}
          <Link href="/docs/file-conventions/content-directory">
            <Code>content</Code> directory
          </Link>
        </b>
        <FileTree.Folder name="app" defaultOpen>
          <FileTree.Folder name="[[...mdxPath]]" defaultOpen>
            <FileTree.File name="page.jsx" />
          </FileTree.Folder>
          {layout}
        </FileTree.Folder>
        <FileTree.Folder name="content" defaultOpen>
          {children}
        </FileTree.Folder>
      </FileTree>
      <FileTree>
        <b>
          Using{' '}
          <Link href="/docs/file-conventions/page-file">
            <Code>page.mdx</Code> files
          </Link>
        </b>
        <FileTree.Folder name="app" defaultOpen>
          {/* @ts-expect-error -- fixme */}
          {mapChildren([layout, ...children])}
        </FileTree.Folder>
      </FileTree>
    </>
  )
}
