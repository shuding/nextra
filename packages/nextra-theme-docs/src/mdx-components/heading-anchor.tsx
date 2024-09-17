'use client'

import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { useActiveAnchor, useActiveAnchorActions } from '../contexts'

export const HeadingAnchor: FC<{ id: string }> = ({ id }) => {
  const { setActiveAnchor } = useActiveAnchorActions()
  const { observer } = useActiveAnchor()
  const anchorRef = useRef<HTMLAnchorElement>(null!)

  useEffect(() => {
    if (!observer) return
    observer.observe(anchorRef.current)

    return () => {
      observer.disconnect()
      setActiveAnchor(f => {
        const ret = { ...f }
        delete ret[id]
        return ret
      })
    }
  }, [observer, setActiveAnchor])

  return (
    <a
      href={`#${id}`}
      className="nextra-focus subheading-anchor"
      aria-label="Permalink for this section"
      ref={anchorRef}
    />
  )
}
