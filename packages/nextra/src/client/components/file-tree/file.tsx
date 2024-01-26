import cn from 'clsx'
import type { ReactElement } from 'react'
import { memo } from 'react'
import { Indent } from './file-tree.js'

type FileProps = {
  name: string
  label?: ReactElement
  active?: boolean
}

export const File = ({ label, name, active }: FileProps) => (
  <li
    className={cn(
      '_flex _list-none',
      active && '_text-primary-600 contrast-more:_underline'
    )}
  >
    <span className="_flex _items-center _py-1">
      <Indent />
      <svg width="1em" height="1em" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z"
        />
      </svg>
      <span className="_ml-1">{label ?? name}</span>
    </span>
  </li>
)
