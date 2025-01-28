'use client'

import cn from 'clsx'
import type { FC, ReactNode } from 'react'
import { Children, useEffect, useRef, useState } from 'react'

export const Collapse: FC<{
  className?: string
  children: ReactNode
  isOpen: boolean
  horizontal?: boolean
  openDuration?: number
  closeDuration?: number
}> = ({
  className,
  children,
  isOpen,
  horizontal = false,
  openDuration = 500,
  closeDuration = 300
}) => {
  const containerRef = useRef<HTMLDivElement>(null!)
  const [initialOpen] = useState(isOpen)
  const animationRef = useRef(0)
  const initialRender = useRef(true)
  useEffect(() => {
    const animation = animationRef.current
    const container = containerRef.current
    if (animation) {
      clearTimeout(animation)
      animationRef.current = 0
    }

    if (initialRender.current) {
      return
    }
    const child = container.children[0] as HTMLDivElement

    if (horizontal) {
      // save initial width to avoid word wrapping when container width will be changed
      child.style.width = `${child.clientWidth}px`
      container.style.width = `${child.clientWidth}px`
    } else {
      container.style.height = `${child.clientHeight}px`
    }
    if (isOpen) {
      animationRef.current = window.setTimeout(() => {
        // should be style property in kebab-case, not CSS class name
        container.style.removeProperty('height')
      }, openDuration)
    } else {
      requestAnimationFrame(() => {
        // Hide content on next tick
        if (horizontal) {
          container.style.width = '0'
        } else {
          container.style.height = '0'
        }
      })
    }
  }, [horizontal, isOpen, openDuration])

  useEffect(() => {
    if (
      // for horizontal only for first open state
      isOpen ||
      !horizontal
    ) {
      initialRender.current = false
    }
  }, [horizontal, isOpen])

  // Add inner <div> only if children.length != 1
  const newChildren =
    Children.count(children) === 1 &&
    children &&
    typeof children === 'object' &&
    'type' in children ? (
      children
    ) : (
      <div>{children}</div>
    )

  return (
    <div
      ref={containerRef}
      className={cn(
        'x:transform-gpu x:transition-all x:ease-in-out x:motion-reduce:transition-none',
        isOpen ? 'x:opacity-100' : 'x:opacity-0 x:overflow-hidden',
        className
      )}
      style={{
        ...(initialOpen || horizontal ? undefined : { height: 0 }),
        transitionDuration: (isOpen ? openDuration : closeDuration) + 'ms'
      }}
    >
      {newChildren}
    </div>
  )
}
