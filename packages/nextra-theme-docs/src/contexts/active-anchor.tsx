import type { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'
import 'intersection-observer'
import { createContext, useContext, useRef, useState } from 'react'
import { IS_BROWSER } from '../constants'

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
const SetActiveAnchorContext = createContext<
  Dispatch<SetStateAction<ActiveAnchor>>
>(v => v)

const IntersectionObserverContext = createContext<IntersectionObserver | null>(
  null
)
const slugs = new WeakMap()
const SlugsContext = createContext<WeakMap<any, any>>(slugs)
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
  if (IS_BROWSER && !observerRef.current) {
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
        rootMargin: '0px 0px -50%',
        threshold: [0, 1]
      }
    )
  }
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
