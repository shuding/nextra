import React, { useState, useCallback, createContext, useContext } from 'react'
import cn from 'clsx'
import type { ReactElement } from 'react'

const ctx = createContext(0)

export const { Provider, Consumer } = ctx
export function useIndent() {
  return useContext(ctx) || 0
}
export default ctx

interface FolderProps {
  name: string
  label?: ReactElement
  open?: boolean
  defaultOpen?: boolean
  onToggle?: (open: boolean) => void
  children: ReactElement | ReactElement[]
}

interface FileProps {
  name: string
  label?: ReactElement
  active?: boolean
  children: ReactElement | ReactElement[]
}

const Tree: React.FC<{
  children: ReactElement | ReactElement[]
}> = ({ children }) => <div className="text-base mt-6">{children}</div>

function Ident() {
  const indent = useIndent()

  return (
    <>
      {[...Array(indent)].map((_, i) => (
        <span className="inline-block w-5 h-7" key={i} />
      ))}
    </>
  )
}

const Folder: React.FC<FolderProps> = React.memo(
  ({ label, name, open, children, defaultOpen, onToggle }) => {
    const indent = useIndent()

    const [isOpen, setIsOpen] = useState(defaultOpen || false)

    const toggle = useCallback(() => {
      onToggle && onToggle(!isOpen)
      setIsOpen(!isOpen)
    }, [isOpen, onToggle])

    const isFolderOpen = typeof open === 'undefined' ? isOpen : open

    return (
      <li className={cn('list-none', { ['']: isFolderOpen })}>
        <a
          onClick={toggle}
          title={name}
          className="inline-flex items-center cursor-pointer"
        >
          <Ident />
          <span className={''}>
            {isFolderOpen ? (
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1M5 19h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2Z"
                ></path>
              </svg>
            ) : (
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2Z"
                ></path>
              </svg>
            )}
          </span>
          <span className={'ml-1'}>{label ?? name}</span>
        </a>
        {isFolderOpen ? (
          <ul>
            <Provider value={indent + 1}>{children}</Provider>
          </ul>
        ) : null}
      </li>
    )
  }
)

Folder.displayName = 'Folder'

const File: React.FC<FileProps> = React.memo(
  ({ label, name, active, ...props }) => {
    return (
      <li className={cn('list-none flex', { ['']: active })}>
        <a {...props} className="inline-flex items-center cursor-default">
          <Ident />
          <span className={''}>
            <svg width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z"
              ></path>
            </svg>
          </span>
          <span className={'ml-1'}>{label ?? name}</span>
        </a>
      </li>
    )
  }
)

File.displayName = 'File'

export { Tree, Folder, File }
