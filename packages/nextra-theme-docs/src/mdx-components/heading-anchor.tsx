'use client'

import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { useActiveAnchorActions } from '../contexts'

export const HeadingAnchor: FC<{ id: string }> = ({ id }) => {
  const { observeAnchor } = useActiveAnchorActions()
  const anchorRef = useRef<HTMLAnchorElement>(null!)

  useEffect(() => observeAnchor(anchorRef.current), [])

  return (
    <a
      href={`#${id}`}
      className="nextra-focus subheading-anchor"
      aria-label="Permalink for this section"
      ref={anchorRef}
    />
  )
}
