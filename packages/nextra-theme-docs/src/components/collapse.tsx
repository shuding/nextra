import React, { useRef, useEffect, ReactElement } from 'react'
import cn from 'clsx'

export function Collapse({
  children,
  className,
  open
}: {
  children: React.ReactNode
  className?: string
  open: boolean
}): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<any>()
  const initialRender = useRef(true)
  const initialState = useRef(open)

  useEffect(() => {
    if (initialRender.current) return

    if (animationRef.current) {
      clearTimeout(animationRef.current)
    }
    if (open) {
      const container = containerRef.current
      const inner = innerRef.current
      if (container && inner) {
        const contentHeight = innerRef.current.clientHeight
        container.style.maxHeight = contentHeight + 'px'
        container.classList.remove('duration-500')
        container.classList.add('duration-300')

        inner.style.opacity = '1'
        animationRef.current = setTimeout(() => {
          const container = containerRef.current
          if (container) {
            container.style.removeProperty('max-height')
          }
        }, 300)
      }
    } else {
      const container = containerRef.current
      const inner = innerRef.current
      if (container && inner) {
        const contentHeight = innerRef.current.clientHeight
        container.style.maxHeight = contentHeight + 'px'
        container.classList.remove('duration-300')
        container.classList.add('duration-500')

        inner.style.opacity = '0'
        setTimeout(() => {
          const container = containerRef.current
          if (container) {
            container.style.maxHeight = '0px'
          }
        }, 0)
      }
    }
  }, [open])

  useEffect(() => {
    initialRender.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className="transform-gpu overflow-hidden transition-all duration-300 ease-in-out motion-reduce:transition-none"
      style={{
        maxHeight: initialState.current ? undefined : 0
      }}
    >
      <div
        ref={innerRef}
        className={cn(
          'p-2 transform-gpu overflow-hidden transition-opacity duration-500 ease-in-out motion-reduce:transition-none',
          className
        )}
        style={{
          opacity: initialState.current ? 1 : 0
        }}
      >
        {children}
      </div>
    </div>
  )
}
