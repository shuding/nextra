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
      ref.current?.classList.toggle('nx-opacity-0', scrollTop < 300)
    }

    window.addEventListener('scroll', toggleVisible)
    return () => {
      window.removeEventListener('scroll', toggleVisible)
    }
  }, [])

  return (
    <button
      ref={ref}
      aria-hidden="true"
      onClick={scrollToTop}
      className={cn(
        'nx-flex nx-items-center nx-gap-1.5 nx-transition nx-opacity-0',
        className
      )}
    >
      Scroll to top
      <ArrowRightIcon className="-nx-rotate-90 nx-w-3.5 nx-h-3.5 nx-border nx-rounded-full nx-border-current" />
    </button>
  )
}
