import type { Dispatch } from 'react'
import { create } from 'zustand'

const useActiveAnchorStore = create<{
  observer: IntersectionObserver
  activeSlug: string
  actions: {
    observeAnchor: (el: HTMLAnchorElement) => Dispatch<void>
  }
}>((set, get) => {
  const callback: IntersectionObserverCallback = entries => {
    const entry = entries.find(entry => entry.isIntersecting) || entries[0]
    console.log(entries)
    const activeSlug = entry
      ? (entry.target as HTMLAnchorElement).hash.slice(1)
      : ''

    set({ activeSlug })
  }

  return {
    activeSlug: '',
    observer:
      typeof window === 'undefined'
        ? null!
        : new IntersectionObserver(callback, {
            // Can be null if error is thrown from app somewhere
            rootMargin: `-${document.querySelector('article')?.offsetTop ?? 0}px 0px -80%`,
            threshold: [0, 1]
          }),
    actions: {
      observeAnchor(anchorElement) {
        const { observer } = get()
        observer.observe(anchorElement)
        return () => {
          observer.unobserve(anchorElement)
        }
      }
    }
  }
})

export const useActiveAnchor = () =>
  useActiveAnchorStore(state => state.activeSlug)

export const useActiveAnchorActions = () =>
  useActiveAnchorStore(state => state.actions)
