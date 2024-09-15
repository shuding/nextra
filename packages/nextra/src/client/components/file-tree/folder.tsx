'use client'

import cn from 'clsx'
import { Button } from '../button.js'
import { memo, useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { FolderIcon, FolderOpenIcon } from '../../icons/index.js'
import type { FileProps } from './file.js'

type FolderProps = FileProps & {
  open?: boolean
  defaultOpen?: boolean
  children: ReactNode
}

export const Folder = memo<FolderProps>(
  ({ name, open, children, defaultOpen = false, active }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    const toggle = useCallback(() => {
      setIsOpen(v => !v)
    }, [])

    const isFolderOpen = open === undefined ? isOpen : open

    const ComponentToUse = isFolderOpen ? FolderOpenIcon : FolderIcon

    return (
      <li className="_flex _flex-col _gap-1">
        <Button
          onClick={toggle}
          className={({ hover }) =>
            cn(
              '_flex _items-center _gap-1 _break-all',
              '_text-left', // override browser default
              hover && '_opacity-60',
              active && '_text-primary-600'
            )
          }
        >
          {/* Text can shrink icon */}
          <ComponentToUse height="14" className="_shrink-0" />
          {name}
        </Button>
        {isFolderOpen && (
          <ul className="_flex _flex-col _gap-2 _ps-4">{children}</ul>
        )}
      </li>
    )
  }
)
Folder.displayName = 'Folder'
