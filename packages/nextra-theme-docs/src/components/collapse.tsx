import { useRef, useEffect, ReactElement, ReactNode } from 'react'
import { useMounted } from 'nextra/hooks'
import cn from 'clsx'

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
  const initialOpen = useRef(isOpen)
  const mounted = useMounted()

  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    if (!mounted || !container || !inner) return

    container.classList.toggle('nx-duration-500', !isOpen)
    container.classList.toggle('nx-duration-300', isOpen)

    if (horizontal) {
      // save initial width to avoid word wrapping when container width will be changed
      inner.style.width = `${inner.clientWidth}px`
      container.style.width = `${isOpen ? inner.clientWidth : 0}px`
    } else {
      container.style.height = `${isOpen ? inner.clientHeight : 0}px`
    }
  }, [horizontal, isOpen, mounted])

  return (
    <div
      ref={containerRef}
      className="nx-transform-gpu nx-overflow-hidden nx-transition-all nx-ease-in-out motion-reduce:nx-transition-none"
      style={initialOpen.current || horizontal ? undefined : { height: 0 }}
    >
      <div
        ref={innerRef}
        className={cn(
          'nx-p-2 nx-transition-opacity nx-duration-500 nx-ease-in-out motion-reduce:nx-transition-none',
          isOpen ? 'nx-opacity-100' : 'nx-opacity-0',
          className || ''
        )}
      >
        {children}
      </div>
    </div>
  )
}
