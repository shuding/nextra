'use client'

import type { ComponentPropsWithoutRef, FC } from 'react'
import { useEffect, useRef } from 'react'

export const ClientBanner: FC<ComponentPropsWithoutRef<'div'>> = props => {
  const banner = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect
        // Set height because banner text can be wrapped on next line and his height can be different
        document.documentElement.style.setProperty(
          '--nextra-banner-height',
          `${height}px`
        )
      }
    })
    resizeObserver.observe(banner.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return <div ref={banner} {...props} />
}
