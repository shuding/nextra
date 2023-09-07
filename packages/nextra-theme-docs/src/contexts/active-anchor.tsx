import type { ContextType, ReactElement, ReactNode } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import 'intersection-observer'

// Separate the state of 2 contexts to avoid re-renders of the content triggered
// by the state update
const ActiveAnchorContext = createContext('')
const ObserverContext = createContext<IntersectionObserver | null>(null)

export const useActiveAnchor = () => useContext(ActiveAnchorContext)
export const useObserver = () => useContext(ObserverContext)

export function ActiveAnchorProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const [activeId, setActiveId] = useState('')
  const observerRef = useRef<ContextType<typeof ObserverContext>>(null)

  useEffect(() => {
    observerRef.current?.disconnect()

    observerRef.current = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.intersectionRatio > 0 && entry.isIntersecting) {
            setActiveId(entry.target.getAttribute('id')!)
          }
        }
      },
      { rootMargin: '0px 0px -80%' }
    )
    const observer = observerRef.current

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <ObserverContext.Provider value={observerRef.current}>
      <ActiveAnchorContext.Provider value={activeId}>
        {children}
      </ActiveAnchorContext.Provider>
    </ObserverContext.Provider>
  )
}
