import cn from 'clsx'
import type { ReactElement, ReactNode } from 'react'
import { useEffect, useRef } from 'react'

export function Collapse({
  children,
  className,
  isOpen,
  horizontal = false
}: {
  children: ReactNode
  className?: string
  isOpen: boolean
  horizontal?: boolean
}): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef(0)
  const initialOpen = useRef(isOpen)
  const initialRender = useRef(true)

  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    const animation = animationRef.current
    if (animation) {
      clearTimeout(animation)
    }
    if (initialRender.current || !container || !inner) return

    container.classList.toggle('_duration-500', !isOpen)
    container.classList.toggle('_duration-300', isOpen)

    if (horizontal) {
      // save initial width to avoid word wrapping when container width will be changed
      inner.style.width = `${inner.clientWidth}px`
      container.style.width = `${inner.clientWidth}px`
    } else {
      container.style.height = `${inner.clientHeight}px`
    }

    if (isOpen) {
      animationRef.current = window.setTimeout(() => {
        // should be style property in kebab-case, not css class name
        container.style.removeProperty('height')
      }, 300)
    } else {
      setTimeout(() => {
        if (horizontal) {
          container.style.width = '0px'
        } else {
          container.style.height = '0px'
        }
      }, 0)
    }
  }, [horizontal, isOpen])

  useEffect(() => {
    initialRender.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className="_transform-gpu _overflow-hidden _transition-all _ease-in-out motion-reduce:_transition-none"
      style={initialOpen.current || horizontal ? undefined : { height: 0 }}
    >
      <div
        ref={innerRef}
        className={cn(
          '_transition-opacity _duration-500 _ease-in-out motion-reduce:_transition-none',
          isOpen ? '_opacity-100' : '_opacity-0',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
