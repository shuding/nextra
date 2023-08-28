import cn from 'clsx'
import { ArrowRightIcon } from 'nextra/icons'
import type { ReactElement } from 'react'
import { useRef } from 'react'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function BackToTop({
  className,
  hidden
}: {
  className: string
  hidden: boolean
}): ReactElement {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <button
      ref={ref}
      aria-hidden="true"
      onClick={scrollToTop}
      disabled={hidden}
      className={cn(
        'nx-flex nx-items-center nx-gap-1.5 nx-transition',
        hidden ? 'nx-opacity-0' : 'nx-opacity-100',
        className
      )}
    >
      Scroll to top
      <ArrowRightIcon className="-nx-rotate-90 nx-w-3.5 nx-h-3.5 nx-border nx-rounded-full nx-border-current" />
    </button>
  )
}
