import React, { useRef, useEffect } from 'react'

export default function Collapse({
  children,
  open
}: {
  children: React.ReactNode
  open: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<NodeJS.Timeout>()
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
        // container.style.maxHeight = '0px'
        container.style.maxHeight = contentHeight + 'px'

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
        inner.style.opacity = '0'
        setTimeout(() => {
          const container = containerRef.current
          if (container) {
            container.style.maxHeight = '0px'
          }
        })
      }
    }
  }, [open])

  useEffect(() => {
    initialRender.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className="transition-all ease-in-out duration-300 overflow-hidden"
      style={{
        maxHeight: initialState.current ? undefined : 0
      }}
    >
      <div
        ref={innerRef}
        className="nextra-collapse-content transition-opacity ease-in-out duration-300 overflow-hidden"
        style={{
          opacity: initialState.current ? 1 : 0
        }}
      >
        {children}
      </div>
    </div>
  )
}
