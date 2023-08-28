import { useEffect, useRef, useState } from 'react'

// this hook is taken from https://github.com/nextui-org/nextui/blob/main/apps/docs/hooks/use-scroll-spy.ts
export function useScrollSpy(
  selectors: string[],
  options?: IntersectionObserverInit
) {
  const [activeId, setActiveId] = useState<string | null>()
  const observer = useRef<IntersectionObserver>()

  useEffect(() => {
    const elements = selectors.map(selector => document.querySelector(selector))

    if (observer.current) {
      observer.current.disconnect()
    }
    observer.current = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.getAttribute('id'))
        }
      }
    }, options)
    for (const el of elements) {
      el && observer.current?.observe(el)
    }

    return () => observer.current?.disconnect()
  }, [selectors])

  return activeId
}
