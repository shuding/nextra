import type { Dispatch } from 'react'
import { create } from 'zustand'

type ActiveAnchor = Record<
  string,
  {
    index: number
    aboveHalfViewport: boolean
    insideHalfViewport: boolean
  }
>

const useActiveAnchorStore = create<{
  observer: null | IntersectionObserver
  activeSlug: string
  actions: {
    observeAnchor: (el: HTMLAnchorElement) => Dispatch<void>
  }
}>((set, get) => {
  const callback: IntersectionObserverCallback = entries => {
    const ret: ActiveAnchor = Object.create(null)
    for (const [index, entry] of entries.entries()) {
      if (!entry.rootBounds) continue

      const slug = (entry.target as HTMLAnchorElement).hash.slice(1)

      const aboveHalfViewport =
        entry.boundingClientRect.y + entry.boundingClientRect.height <=
        entry.rootBounds.y + entry.rootBounds.height

      ret[slug] = {
        index,
        aboveHalfViewport,
        insideHalfViewport: entry.intersectionRatio > 0
      }
    }

    let [activeSlug] = Object.keys(ret)
    let smallestIndexInViewport = Infinity
    let largestIndexAboveViewport = -1

    for (const [slug, entry] of Object.entries(ret)) {
      const idx = entry.index
      if (entry.aboveHalfViewport && idx > largestIndexAboveViewport) {
        largestIndexAboveViewport = idx
        activeSlug = slug
      } else if (entry.insideHalfViewport && idx < smallestIndexInViewport) {
        smallestIndexInViewport = idx
        activeSlug = slug
      }
    }
    set({ activeSlug })
    return ret
  }

  return {
    observer:
      typeof window === 'undefined'
        ? null
        : new IntersectionObserver(callback, {
            rootMargin: `-${document.querySelector('article')!.offsetTop}px 0px -50%`,
            threshold: [0, 1]
          }),
    activeSlug: '',
    actions: {
      observeAnchor(anchorElement) {
        const { observer } = get()
        observer!.observe(anchorElement)
        return () => {
          observer!.disconnect()
        }
      }
    }
  }
})

export const useActiveAnchor = () =>
  useActiveAnchorStore(state => state.activeSlug)

export const useActiveAnchorActions = () =>
  useActiveAnchorStore(state => state.actions)
