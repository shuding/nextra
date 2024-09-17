'use client'

import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { useActiveAnchor, useActiveAnchorActions } from '../contexts'

export const HeadingAnchor: FC<{ id: string }> = ({ id }) => {
  const { setActiveAnchor } = useActiveAnchorActions()
  const { observer } = useActiveAnchor()
  const anchorRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const anchor = anchorRef.current
    if (!id || !observer || !anchor) return
    observer.observe(anchor)

    return () => {
      observer.disconnect()
      setActiveAnchor(f => {
        const ret = { ...f }
        delete ret[id]
        return ret
      })
    }
  }, [id, observer, setActiveAnchor])

  return (
    <a
      href={`#${id}`}
      className="nextra-focus subheading-anchor"
      aria-label="Permalink for this section"
      ref={anchorRef}
    />
  )
}
