import type { Dispatch } from 'react'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

type ActiveAnchor = Record<
  string,
  {
    index: number
    aboveHalfViewport: boolean
    insideHalfViewport: boolean
  }
>

const useActiveAnchorStore = createWithEqualityFn<{
  observer: null | IntersectionObserver
  activeAnchor: ActiveAnchor
  activeSlug: string
  actions: {
    setActiveAnchor: Dispatch<(prevState: ActiveAnchor) => ActiveAnchor>
  }
}>((set, get) => ({
  get observer() {
    if (typeof window === 'undefined') {
      return null
    }
    const { setActiveAnchor } = get().actions

    const callback: IntersectionObserverCallback = entries => {
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

        let [activeSlug] = Object.keys(ret)
        let smallestIndexInViewport = Infinity
        let largestIndexAboveViewport = -1

        for (const [slug, entry] of Object.entries(ret)) {
          const idx = entry.index
          if (
            smallestIndexInViewport === Infinity &&
            entry.aboveHalfViewport &&
            idx > largestIndexAboveViewport
          ) {
            largestIndexAboveViewport = idx
            activeSlug = slug
          } else if (
            entry.insideHalfViewport &&
            idx < smallestIndexInViewport
          ) {
            smallestIndexInViewport = idx
            activeSlug = slug
          }
        }
        set({ activeSlug })
        return ret
      })
    }

    const navbarHeight = getComputedStyle(document.body).getPropertyValue(
      '--nextra-navbar-height'
    )

    return new IntersectionObserver(callback, {
      rootMargin: `-${navbarHeight} 0px -50%`,
      threshold: [0, 1]
    })
  },
  activeAnchor: Object.create(null),
  activeSlug: '',
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
      observer: state.observer,
      activeSlug: state.activeSlug
    }),
    shallow
  )

export const useActiveAnchorActions = () =>
  useActiveAnchorStore(state => state.actions)
