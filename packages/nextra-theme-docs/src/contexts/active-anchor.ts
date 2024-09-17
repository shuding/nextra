import type { Dispatch } from 'react'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

type ActiveAnchor = Record<
  string,
  {
    isActive?: boolean
    aboveHalfViewport: boolean
    index: number
    insideHalfViewport: boolean
  }
>

const useActiveAnchorStore = createWithEqualityFn<{
  observer: null | IntersectionObserver
  activeAnchor: ActiveAnchor
  actions: {
    setActiveAnchor: Dispatch<(prevState: ActiveAnchor) => ActiveAnchor>
  }
}>((set, get) => ({
  get observer() {
    if (typeof window === 'undefined') {
      return null
    }
    const navbarHeight = getComputedStyle(document.body).getPropertyValue(
      '--nextra-navbar-height'
    )

    const { setActiveAnchor } = get().actions

    return new IntersectionObserver(
      entries => {
        setActiveAnchor(f => {
          const ret = { ...f }

          for (const [index, entry] of entries.entries()) {
            if (!entry.rootBounds) continue

            const slug = (entry.target as HTMLAnchorElement).hash.slice(1)

            const aboveHalfViewport =
              entry.boundingClientRect.y + entry.boundingClientRect.height <=
              entry.rootBounds.y + entry.rootBounds.height

            ret[slug] = {
              // Use initial index, since entries array will be changed after mount
              index: ret[slug]?.index ?? index,
              aboveHalfViewport,
              insideHalfViewport: entry.intersectionRatio > 0
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
        rootMargin: `-${navbarHeight} 0px -50%`,
        threshold: [0, 1]
      }
    )
  },
  activeAnchor: Object.create(null),
  slugs: new WeakMap(),
  actions: {
    setActiveAnchor(fn) {
      set(state => ({
        activeAnchor: fn(state.activeAnchor)
      }))
    }
  }
}))

export const useActiveAnchor = () =>
  useActiveAnchorStore(
    state => ({
      activeAnchor: state.activeAnchor,
      observer: state.observer
    }),
    shallow
  )

export const useActiveAnchorActions = () =>
  useActiveAnchorStore(state => state.actions)
