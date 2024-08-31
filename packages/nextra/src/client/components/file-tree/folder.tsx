'use client'

import { createContext, memo, useCallback, useContext, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'

const ctx = createContext(0)

function useIndent() {
  return useContext(ctx)
}

type FolderProps = {
  name: string
  label?: ReactElement
  open?: boolean
  defaultOpen?: boolean
  onToggle?: (open: boolean) => void
  children: ReactNode
}

export function Indent(): ReactElement[] {
  const length = useIndent()
  return Array.from({ length }, (_, index) => (
    // Text can shrink indent
    <span className="_w-5 _shrink-0" key={index} />
  ))
}

export const Folder = memo<FolderProps>(
  ({ label, name, open, children, defaultOpen = false, onToggle }) => {
    const indent = useIndent()
    const [isOpen, setIsOpen] = useState(defaultOpen)

    const toggle = useCallback(() => {
      onToggle?.(!isOpen)
      setIsOpen(!isOpen)
    }, [isOpen, onToggle])

    const isFolderOpen = open === undefined ? isOpen : open

    return (
      <li className="_flex _list-none _flex-col">
        <button
          onClick={toggle}
          title={name}
          className="_flex _items-center _py-1 hover:_opacity-60"
        >
          <Indent />
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            // Text can shrink icon
            className="_shrink-0"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isFolderOpen
                  ? 'M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1M5 19h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2Z'
                  : 'M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2Z'
              }
            />
          </svg>
          <span className="_ms-1">{label ?? name}</span>
        </button>
        {isFolderOpen && (
          <ul>
            <ctx.Provider value={indent + 1}>{children}</ctx.Provider>
          </ul>
        )}
      </li>
    )
  }
)
Folder.displayName = 'Folder'
