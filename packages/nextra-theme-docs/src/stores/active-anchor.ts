import type { Dispatch } from 'react'
import { create } from 'zustand'

const cb: IntersectionObserverCallback = entries => {
  const entry = entries.find(entry => entry.isIntersecting)
  console.log(
    entries.map(
      entry =>
        `${entry.isIntersecting}_${(entry.target as HTMLAnchorElement).hash.slice(1)}`
    ),
    entries.filter(entry => entry.isIntersecting)
  )
  if (entry) {
    const slug = (entry.target as HTMLAnchorElement).hash.slice(1)
    useActiveAnchorStore.setState({ activeSlug: slug })
  }
}

const observer: IntersectionObserver =
  typeof window === 'undefined'
    ? null!
    : new IntersectionObserver(cb, {
        rootMargin: `-${getComputedStyle(document.body).getPropertyValue(
          '--nextra-navbar-height'
        )} 0% -80%`,
        threshold: [0, 1]
      })

const useActiveAnchorStore = create<{
  activeSlug: string
  actions: {
    observeAnchor: (el: HTMLAnchorElement) => Dispatch<void>
  }
}>(() => ({
  activeSlug: '',
  actions: {
    observeAnchor(anchorElement) {
      observer.observe(anchorElement)
      return () => {
        observer.unobserve(anchorElement)
      }
    }
  }
}))

export const useActiveAnchor = () =>
  useActiveAnchorStore(state => state.activeSlug)

export const useActiveAnchorActions = () =>
  useActiveAnchorStore(state => state.actions)
