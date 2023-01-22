import type { ComponentProps, ReactElement } from 'react'

export function SunIcon(props: ComponentProps<'svg'>): ReactElement {
  return (
    <svg
      fill="none"
      viewBox="3 3 18 18"
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
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  )
}
