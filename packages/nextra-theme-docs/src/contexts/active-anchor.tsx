'use client'

import type { Dispatch, SetStateAction } from 'react'
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

type ActiveAnchor = Record<
  string,
  {
    isActive?: boolean
    aboveHalfViewport: boolean
    index: number
    insideHalfViewport: boolean
  }
>

const useActiveAnchorStore = create<{
  observer: null | IntersectionObserver
  activeAnchor: ActiveAnchor
  slugs: WeakMap<any, any>
  actions: {
    setActiveAnchor: Dispatch<SetStateAction<ActiveAnchor>>
  }
}>((set, get) => ({
  get observer() {
    if (typeof window === 'undefined') {
      return null
    }
    // console.log(useActiveAnchorStore())
    const navbarHeight = getComputedStyle(document.body).getPropertyValue(
      '--nextra-navbar-height'
    )

    const {
      actions: { setActiveAnchor },
      slugs
    } = get()

    return new IntersectionObserver(
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
        rootMargin: `-${navbarHeight} 0px -50%`,
        threshold: [0, 1]
      }
    )
  },
  activeAnchor: {},
  slugs: new WeakMap(),
  actions: {
    setActiveAnchor(activeAnchor) {
      set(
        typeof activeAnchor === 'function'
          ? state => ({ activeAnchor: activeAnchor(state.activeAnchor) })
          : { activeAnchor }
      )
    }
  }
}))

export const useActiveAnchor = () =>
  useActiveAnchorStore(
    state => ({
      activeAnchor: state.activeAnchor,
      observer: state.observer,
      slugs: state.slugs
    }),
    shallow
  )

export const useActiveAnchorActions = () =>
  useActiveAnchorStore(state => state.actions)
