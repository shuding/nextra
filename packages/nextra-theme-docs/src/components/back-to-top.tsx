import cn from 'clsx'
import { ArrowRightIcon } from 'nextra/icons'
import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function BackToTop({ className }: { className?: string }): ReactElement {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    function toggleVisible() {
      const { scrollTop } = document.documentElement
      if (scrollTop < 300) {
        ref.current?.classList.add('_opacity-0', '_pointer-events-none')
      } else {
        ref.current?.classList.remove('_opacity-0', '_pointer-events-none')
      }
    }

    window.addEventListener('scroll', toggleVisible)
    return () => {
      window.removeEventListener('scroll', toggleVisible)
    }
  }, [])

  return (
    <button
      aria-hidden="true"
      ref={ref}
      onClick={scrollToTop}
      className={cn(
        '_flex _items-center _gap-1.5 _transition _opacity-0',
        className
      )}
    >
      Scroll to top
      <ArrowRightIcon className="_-rotate-90 _size-4 _border _rounded-full _border-current" />
    </button>
  )
}
