'use client'

import { Link } from 'next-view-transitions'
import { useFSRoute } from 'nextra/hooks'
import type { ComponentProps, FC } from 'react'

export const NavbarLink: FC<ComponentProps<typeof Link>> = props => {
  const pathname = useFSRoute()
  return (
    <Link
      className="x:aria-[current]:no-underline x:aria-[current]:opacity-60"
      aria-current={props.href === pathname || undefined}
      {...props}
    />
  )
}
