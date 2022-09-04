import React, { useRef, useEffect, ReactElement } from 'react'
import { useMounted } from '../hooks'

export function Collapse({
  children,
  open,
  vertical = true,
  className
}: {
  children: React.ReactNode
  open: boolean
  vertical?: boolean
  className?: string
}): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<NodeJS.Timeout>()
  const mounted = useMounted()
  const initialOpen = useRef(open).current

  useEffect(() => {
    if (!mounted) return
    const container = containerRef.current
    const inner = innerRef.current
    const animationId = animationRef.current
    if (animationId) {
      clearTimeout(animationId)
    }

    if (!container || !inner) return
    if (vertical) {
      container.style.maxHeight = `${inner.clientHeight}px`
    } else {
      inner.style.minWidth = `${inner.clientWidth}px`
    }

    inner.classList.toggle('opacity-100', open)
    inner.classList.toggle('opacity-0', !open)

    if (open) {
      animationRef.current = setTimeout(() => {
        container.style.removeProperty(vertical ? 'max-height' : 'max-width')
      }, 300)
      return
    }
    setTimeout(() => {
      if (vertical) {
        container.style.maxHeight = '0px'
      }
    }, 0)
  }, [open])

  return (
    <div
      ref={containerRef}
      className={[
        'transform-gpu overflow-y-hidden ease-in-out motion-reduce:transition-none transition-all',
        open ? 'duration-300' : 'duration-500',
        className
      ].join(' ')}
      style={{
        ...(!initialOpen && (vertical && { maxHeight: 0 }))
      }}
    >
      <div
        ref={innerRef}
        className={[
          'transform-gpu ease-in-out motion-reduce:transition-none transition-opacity duration-500 p-2',
          initialOpen ? 'opacity-100' : 'opacity-0'
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
