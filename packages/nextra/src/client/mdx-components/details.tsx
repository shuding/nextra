'use client'

import cn from 'clsx'
import type {
  ComponentProps,
  Dispatch,
  FC,
  MouseEvent,
  ReactNode,
  SetStateAction
} from 'react'
import { Children, cloneElement, useEffect, useRef, useState } from 'react'
import { Collapse } from '../components/collapse.js'
import { useHash } from '../hooks/index.js'

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

  const [summaryElement, restChildren] = findSummary(children, setIsOpen)

  const hash = useHash()
  const detailsRef = useRef<HTMLDetailsElement>(null!)
  useEffect(() => {
    if (!hash) return
    const elementWithHashId = detailsRef.current.querySelector(`[id="${hash}"]`)
    if (!elementWithHashId) return
    setIsOpen(true)
  }, [hash])

  return (
    <details
      className={cn(
        'x:not-first:mt-4 x:rounded x:border x:border-gray-200 x:bg-white x:p-2 x:shadow-sm x:dark:border-neutral-800 x:dark:bg-neutral-900',
        'x:overflow-hidden',
        className
      )}
      ref={detailsRef}
      {...props}
      // `isOpen ||` fix issue on mobile devices while clicking on details, open attribute is still
      // false, and we can't calculate child.clientHeight
      open={isOpen || delayedOpenState}
      data-expanded={isOpen ? '' : undefined}
    >
      {summaryElement}
      <Collapse
        isOpen={isOpen}
        className={cn(
          'x:*:pt-2',
          'x:grid' // fix sudden height jump on open state https://github.com/shuding/nextra/issues/4074
        )}
      >
        {restChildren}
      </Collapse>
    </details>
  )
}

// Fix Unsupported declaration type for hoisting. variable "findSummary" declared with FunctionExpression
function findSummary(
  list: ReactNode,
  setIsOpen: Dispatch<SetStateAction<boolean>>
): [summary: ReactNode, ReactNode] {
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
          // @ts-expect-error -- fixme
          onClick(event: MouseEvent) {
            // @ts-expect-error -- fixme
            if (event.target.tagName !== 'A') {
              event.preventDefault()
              setIsOpen(v => !v)
            }
          }
        })
        return
      }
      // @ts-expect-error -- fixme
      if (child.type !== Details && child.props.children) {
        // @ts-expect-error -- fixme
        ;[summary, child] = findSummary(child.props.children, setIsOpen)
      }
    }
    return child
  })

  return [summary, rest]
}
