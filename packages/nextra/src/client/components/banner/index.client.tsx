'use client'

import type { ComponentPropsWithoutRef, FC } from 'react'
import { useEffect, useRef } from 'react'

export const ClientBanner: FC<ComponentPropsWithoutRef<'div'>> = props => {
  const el = useRef<HTMLDivElement>(null!)
  // Set height on mount because text can be wrapped on next line and height can be different
  useEffect(() => {
    const height = el.current.clientHeight
    document.documentElement.style.setProperty(
      '--nextra-banner-height',
      `${height}px`
    )
  }, [])

  return (
    <div
      ref={el}
      // Because we update class in `<script>`
      suppressHydrationWarning
      {...props}
    />
  )
}
