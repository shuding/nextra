import type { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

type ActiveAnchor = Record<
  string,
  {
    isActive?: boolean
    aboveHalfViewport: boolean
    index: number
    insideHalfViewport: boolean
  }
>

const ActiveAnchorContext = createContext<ActiveAnchor>({})
ActiveAnchorContext.displayName = 'ActiveAnchor'

const SetActiveAnchorContext = createContext<
  Dispatch<SetStateAction<ActiveAnchor>>
>(v => v)
SetActiveAnchorContext.displayName = 'SetActiveAnchor'

const IntersectionObserverContext = createContext<IntersectionObserver | null>(
  null
)
IntersectionObserverContext.displayName = 'IntersectionObserver'
const slugs = new WeakMap()
const SlugsContext = createContext<WeakMap<any, any>>(slugs)
SlugsContext.displayName = 'Slugs'
// Separate the state as 2 contexts here to avoid
// re-renders of the content triggered by the state update.
export const useActiveAnchor = () => useContext(ActiveAnchorContext)
export const useSetActiveAnchor = () => useContext(SetActiveAnchorContext)

export const useIntersectionObserver = () =>
  useContext(IntersectionObserverContext)
export const useSlugs = () => useContext(SlugsContext)

export const ActiveAnchorProvider = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const [activeAnchor, setActiveAnchor] = useState<ActiveAnchor>({})
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (observerRef.current) return
    const nextraContentEl = document.querySelector<HTMLElement>('.nextra-content')
    const rootMarginTop = nextraContentEl
      ? `${0 - nextraContentEl.offsetTop}px`
      : '0px'
    observerRef.current = new IntersectionObserver(
      entries => {
        setActiveAnchor(f => {
          const ret = { ...f }

          for (const entry of entries) {
            if (entry?.rootBounds && slugs.has(entry.target)) {
              const [slug, index] = slugs.get(entry.target)
              const aboveHalfViewport =
                entry.boundingClientRect.y + entry.boundingClientRect.height <=
                entry.rootBounds.y + entry.rootBounds.height
              const insideHalfViewport = entry.intersectionRatio > 0
              ret[slug] = {
                index,
                aboveHalfViewport,
                insideHalfViewport
              }
            }
          }

          let activeSlug = ''
          let smallestIndexInViewport = Infinity
          let largestIndexAboveViewport = -1
          for (const s in ret) {
            ret[s].isActive = false
            if (
              ret[s].insideHalfViewport &&
              ret[s].index < smallestIndexInViewport
            ) {
              smallestIndexInViewport = ret[s].index
              activeSlug = s
            }
            if (
              smallestIndexInViewport === Infinity &&
              ret[s].aboveHalfViewport &&
              ret[s].index > largestIndexAboveViewport
            ) {
              largestIndexAboveViewport = ret[s].index
              activeSlug = s
            }
          }

          if (ret[activeSlug]) ret[activeSlug].isActive = true
          return ret
        })
      },
      {
        rootMargin: `${rootMarginTop} 0px -50%`,
        threshold: [0, 1]
      }
    )

    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
    }
  }, [])
  return (
    <ActiveAnchorContext.Provider value={activeAnchor}>
      <SetActiveAnchorContext.Provider value={setActiveAnchor}>
        <SlugsContext.Provider value={slugs}>
          <IntersectionObserverContext.Provider value={observerRef.current}>
            {children}
          </IntersectionObserverContext.Provider>
        </SlugsContext.Provider>
      </SetActiveAnchorContext.Provider>
    </ActiveAnchorContext.Provider>
  )
}
