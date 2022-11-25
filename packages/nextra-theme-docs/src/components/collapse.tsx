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
        container.classList.remove('nx-duration-500')
        container.classList.add('nx-duration-300')

        inner.style.opacity = '1'
        animationRef.current = setTimeout(() => {
          const container = containerRef.current
          if (container) {
            // should be style property in kebab-case, not css class name
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
        container.classList.remove('nx-duration-300')
        container.classList.add('nx-duration-500')

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
      className="nx-transform-gpu nx-overflow-hidden nx-transition-all nx-duration-300 nx-ease-in-out motion-reduce:nx-transition-none"
      style={{
        maxHeight: initialState.current ? undefined : 0
      }}
    >
      <div
        ref={innerRef}
        className={cn(
          'nx-transform-gpu nx-overflow-hidden nx-p-2 nx-transition-opacity nx-duration-500 nx-ease-in-out motion-reduce:nx-transition-none',
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
