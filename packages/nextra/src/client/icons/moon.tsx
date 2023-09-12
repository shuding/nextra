import type { ComponentProps, ReactElement } from 'react'

export function MoonIcon(props: ComponentProps<'svg'>): ReactElement {
  return (
    <svg
      fill="none"
      viewBox="2 2 20 20"
      width="12"
      height="12"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        fill="currentColor"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  )
}
