import type { RefCallback } from 'react'
import { useRef, useCallback, useMemo } from 'react'
import type { Options } from '@popperjs/core'
import { createPopper } from '@popperjs/core'

/**
 * https://github.com/tailwindlabs/headlessui/issues/59
 * Example implementation to use Popper: https://popper.js.org
 */
export function usePopper(
  options?: Partial<Options>
): [RefCallback<Element | null>, RefCallback<HTMLElement | null>] {
  const reference = useRef<Element | null>(null)
  const popper = useRef<HTMLElement | null>(null)

  const cleanupCallback = useRef<() => void>()

  const instantiatePopper = useCallback(() => {
    if (!reference.current || !popper.current) return

    cleanupCallback.current?.()
    cleanupCallback.current = createPopper(
      reference.current,
      popper.current,
      options
    ).destroy
  }, [reference, popper, cleanupCallback, options])

  return useMemo(
    () => [
      referenceDomNode => {
        reference.current = referenceDomNode
        instantiatePopper()
      },
      popperDomNode => {
        popper.current = popperDomNode
        instantiatePopper()
      }
    ],
    [reference, popper, instantiatePopper]
  )
}
