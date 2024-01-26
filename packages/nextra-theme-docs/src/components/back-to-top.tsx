import cn from 'clsx'
import { ArrowRightIcon } from 'nextra/icons'
import type { ReactElement } from 'react'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function BackToTop({
  className,
  hidden
}: {
  className?: string
  hidden: boolean
}): ReactElement {
  return (
    <button
      aria-hidden="true"
      onClick={scrollToTop}
      disabled={hidden}
      className={cn(
        '_flex _items-center _gap-1.5 _transition _opacity-100 disabled:_opacity-0',
        className
      )}
    >
      Scroll to top
      <ArrowRightIcon className="_-rotate-90 _size-4 _border _rounded-full _border-current" />
    </button>
  )
}
