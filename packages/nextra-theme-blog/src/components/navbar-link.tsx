'use client'

import { Link } from 'next-view-transitions'
import { useFSRoute } from 'nextra/hooks'
import { ComponentProps, FC } from 'react'

export const NavbarLink: FC<ComponentProps<typeof Link>> = props => {
  const pathname = useFSRoute()
  return (
    <Link
      className="x:aria-[current=page]:no-underline x:aria-[current=page]:opacity-60"
      aria-current={props.href === pathname ? 'page' : undefined}
      {...props}
    />
  )
}
