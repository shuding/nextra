import cn from 'clsx'
import type { FC, ReactNode } from 'react'
import { FileIcon } from '../../icons/index.js'

export type FileProps = {
  name: ReactNode
  active?: boolean
}

export const File: FC<FileProps> = ({ name, active }) => {
  return (
    <li
      className={cn(
        'x:flex x:items-center x:gap-1 x:break-all',
        active && 'x:text-primary-600'
      )}
    >
      {/* Text can shrink icon */}
      <FileIcon height="14" className="x:shrink-0" />
      {name}
    </li>
  )
}
