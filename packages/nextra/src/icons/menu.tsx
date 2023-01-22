import type { ComponentProps, ReactElement } from 'react'

export function MenuIcon(props: ComponentProps<'svg'>): ReactElement {
  return (
    <svg
      fill="none"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <g>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16"
        />
      </g>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 12h16"
      />
      <g>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 18h16"
        />
      </g>
    </svg>
  )
}
