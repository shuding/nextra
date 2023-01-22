import type { ComponentProps, ReactElement } from 'react'

export function ExpandIcon({
  isOpen,
  ...props
}: { isOpen?: boolean } & ComponentProps<'svg'>): ReactElement {
  return (
    <svg
      height="12"
      width="12"
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M4.177 7.823l2.396-2.396A.25.25 0 017 5.604v4.792a.25.25 0 01-.427.177L4.177 8.177a.25.25 0 010-.354z"
        className={isOpen ? '' : 'nx-origin-[35%] nx-rotate-180'}
      />
      <path
        fillRule="evenodd"
        d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25H9.5v-13H1.75zm12.5 13H11v-13h3.25a.25.25 0 01.25.25v12.5a.25.25 0 01-.25.25z"
      />
    </svg>
  )
}
