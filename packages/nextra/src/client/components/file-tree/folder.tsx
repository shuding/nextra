'use client'

import cn from 'clsx'
import { useState } from 'react'
import type { FC, ReactNode } from 'react'
import { FolderIcon, FolderOpenIcon } from '../../icons/index.js'
import { Button } from '../button.js'
import type { FileProps } from './file.js'

type FolderProps = FileProps & {
  open?: boolean
  /** @default false */
  defaultOpen?: boolean
  children: ReactNode
}

export const Folder: FC<FolderProps> = ({
  name,
  open,
  children,
  defaultOpen = false,
  active
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggle = () => {
    setIsOpen(v => !v)
  }

  const isFolderOpen = open === undefined ? isOpen : open

  const ComponentToUse = isFolderOpen ? FolderOpenIcon : FolderIcon

  return (
    <li className="x:flex x:flex-col x:gap-1">
      <Button
        onClick={toggle}
        disabled={open}
        className={({ hover }) =>
          cn(
            'x:flex x:items-center x:gap-1 x:break-all',
            'x:text-start', // override browser default
            hover && 'x:opacity-60',
            active && 'x:text-primary-600'
          )
        }
      >
        {/* Text can shrink icon */}
        <ComponentToUse height="14" className="x:shrink-0" />
        {name}
      </Button>
      {isFolderOpen && (
        <ul className="x:flex x:flex-col x:gap-2 x:ps-4">{children}</ul>
      )}
    </li>
  )
}
