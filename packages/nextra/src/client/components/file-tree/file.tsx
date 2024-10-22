import cn from 'clsx'
import type { FC, ReactElement } from 'react'
import { FileIcon } from '../../icons/index.js'

export type FileProps = {
  name: ReactElement
  active?: boolean
}

export const File: FC<FileProps> = ({ name, active }) => (
  <li
    className={cn(
      '_flex _items-center _gap-1 _break-all',
      active && '_text-primary-600'
    )}
  >
    {/* Text can shrink icon */}
    <FileIcon height="14 " className="_shrink-0" />
    {name}
  </li>
)
