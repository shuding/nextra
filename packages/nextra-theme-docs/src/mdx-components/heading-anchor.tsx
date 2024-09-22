'use client'

import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { setActiveSlug } from '../stores'

const cb: IntersectionObserverCallback = entries => {
  const entry = entries.find(entry => entry.isIntersecting)

  if (entry) {
    const slug = (entry.target as HTMLAnchorElement).hash.slice(1)
    setActiveSlug(slug)
  }
}

const observer: IntersectionObserver =
  typeof window === 'undefined'
    ? null!
    : new IntersectionObserver(cb, {
        rootMargin: `-${getComputedStyle(document.body).getPropertyValue(
          '--nextra-navbar-height'
        )} 0% -80%`
      })

export const HeadingAnchor: FC<{ id: string }> = ({ id }) => {
  const anchorRef = useRef<HTMLAnchorElement>(null!)

  useEffect(() => {
    const el = anchorRef.current
    observer.observe(el)
    return () => {
      observer.unobserve(el)
    }
  }, [])

  return (
    <a
      href={`#${id}`}
      className="nextra-focus subheading-anchor"
      aria-label="Permalink for this section"
      ref={anchorRef}
    />
  )
}
