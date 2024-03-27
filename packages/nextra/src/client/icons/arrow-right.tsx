import type { ComponentProps, ReactElement } from 'react'

export function ArrowRightIcon({
  pathClassName,
  ...props
}: ComponentProps<'svg'> & { pathClassName?: string }): ReactElement {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7-7 7"
        className={pathClassName}
      />
    </svg>
  )
}
