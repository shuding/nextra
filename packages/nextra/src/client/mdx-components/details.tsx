'use client'

import cn from 'clsx'
import type { ComponentProps, FC, ReactNode } from 'react'
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Collapse } from '../components/collapse.js'

export const Details: FC<ComponentProps<'details'>> = ({
  children,
  open,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(!!open)
  // To animate the close animation we have to delay the DOM node state here.
  const [delayedOpenState, setDelayedOpenState] = useState(isOpen)
  const animationRef = useRef(0)

  useEffect(() => {
    const animation = animationRef.current
    if (animation) {
      clearTimeout(animation)
      animationRef.current = 0
    }
    if (!isOpen) {
      animationRef.current = window.setTimeout(
        () => setDelayedOpenState(isOpen),
        300
      )
      return () => {
        clearTimeout(animationRef.current)
      }
    }
    setDelayedOpenState(true)
  }, [isOpen])

  const [summaryElement, restChildren] = useMemo(
    function findSummary(list = children): [summary: ReactNode, ReactNode] {
      let summary: ReactNode

      const rest = Children.map(list, child => {
        if (
          !summary && // Add onClick only for first summary
          child &&
          typeof child === 'object' &&
          'type' in child
        ) {
          if (child.type === 'summary') {
            summary = cloneElement(child, {
              onClick(event: MouseEvent) {
                event.preventDefault()
                setIsOpen(v => !v)
              }
            })
            return
          }
          if (child.type !== Details && child.props.children) {
            ;[summary, child] = findSummary(child.props.children)
          }
        }
        return child
      })

      return [summary, rest]
    },
    [children]
  )

  return (
    <details
      className={cn(
        'x:[&:not(:first-child)]:mt-4 x:rounded x:border x:border-gray-200 x:bg-white x:p-2 x:shadow-sm x:dark:border-neutral-800 x:dark:bg-neutral-900',
        'x:overflow-hidden',
        className
      )}
      {...props}
      // `isOpen ||` fix issue on mobile devices while clicking on details, open attribute is still
      // false, and we can't calculate child.clientHeight
      open={isOpen || delayedOpenState}
      data-expanded={isOpen ? '' : undefined}
    >
      {summaryElement}
      <Collapse isOpen={isOpen}>{restChildren}</Collapse>
    </details>
  )
}
