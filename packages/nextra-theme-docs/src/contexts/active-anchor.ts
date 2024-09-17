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
  observer: IntersectionObserver
  activeSlug: string
  activeAnchor: ActiveAnchor
  actions: {
    observeAnchor: (el: HTMLAnchorElement) => Dispatch<void>
  }
}>((set, get) => {
  const callback: IntersectionObserverCallback = entries => {
    const ret: ActiveAnchor = { ...get().activeAnchor }

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
    for (const [slug, entry] of Object.entries(ret)) {
      if (entry.insideHalfViewport && entry.index < smallestIndexInViewport) {
        smallestIndexInViewport = entry.index
        activeSlug = slug
      }
      if (
        smallestIndexInViewport === Infinity &&
        entry.aboveHalfViewport &&
        entry.index > largestIndexAboveViewport
      ) {
        largestIndexAboveViewport = entry.index
        activeSlug = slug
      }
    }

    set({ activeSlug, activeAnchor: ret })
  }

  return {
    observer:
      typeof window === 'undefined'
        ? null!
        : new IntersectionObserver(callback, {
            // Can be null if error is thrown from app somewhere
            rootMargin: `-${document.querySelector('article')?.offsetTop ?? 0}px 0px -50%`,
            threshold: [0, 1]
          }),
    activeSlug: '',
    activeAnchor: Object.create(null),
    actions: {
      observeAnchor(anchorElement) {
        const { observer } = get()
        observer.observe(anchorElement)
        return () => {
          set({ activeAnchor: Object.create(null) })
          observer.disconnect()
        }
      }
    }
  }
})

export const useActiveAnchor = () =>
  useActiveAnchorStore(state => state.activeSlug)

export const useActiveAnchorActions = () =>
  useActiveAnchorStore(state => state.actions)
