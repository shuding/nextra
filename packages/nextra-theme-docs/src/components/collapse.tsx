import { useRef, useEffect, ReactElement, ReactNode } from 'react'
import { useMounted } from 'nextra/hooks'

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

    container.classList.toggle('duration-500', !isOpen)
    container.classList.toggle('duration-300', isOpen)

    if (horizontal) {
      // save initial width to avoid word wrapping when container width will be changed
      inner.style.width = `${inner.clientWidth}px`
      container.style.width = `${isOpen ? inner.clientWidth : 0}px`
    } else {
      container.style.height = `${isOpen ? inner.clientHeight : 0}px`
    }
  }, [isOpen, mounted])

  return (
    <div
      ref={containerRef}
      className="transform-gpu overflow-hidden transition-all ease-in-out motion-reduce:transition-none"
      style={initialOpen.current || horizontal ? undefined : { height: 0 }}
    >
      <div
        ref={innerRef}
        className={[
          'p-2 transition-opacity duration-500 ease-in-out motion-reduce:transition-none',
          isOpen ? 'opacity-100' : 'opacity-0',
          className || ''
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
