import type { ComponentProps, ReactElement } from 'react'

export function MediumIcon(props: ComponentProps<'svg'>): ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="currentColor"
         {...props}>
      <path
        d="M13 12C13 15.3137 10.3137 18 7 18C3.68629 18 1 15.3137 1 12C1 8.68629 3.68629 6 7 6C10.3137 6 13 8.68629 13 12Z"/>
      <path
        d="M23 12C23 14.7614 22.5523 17 22 17C21.4477 17 21 14.7614 21 12C21 9.23858 21.4477 7 22 7C22.5523 7 23 9.23858 23 12Z"/>
      <path
        d="M17 18C18.6569 18 20 15.3137 20 12C20 8.68629 18.6569 6 17 6C15.3431 6 14 8.68629 14 12C14 15.3137 15.3431 18 17 18Z"/>
    </svg>
  )
}
