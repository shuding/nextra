import cn from 'clsx'
import { ArrowRightIcon } from 'nextra/icons'
import type { ComponentProps, ReactElement } from 'react'

const SCROLL_TO_OPTIONS = { top: 0, behavior: 'smooth' } as const

const scrollToTop: ComponentProps<'button'>['onClick'] = event => {
  const buttonElement = event.target as HTMLButtonElement
  const tocElement = buttonElement.parentElement!
    .parentElement as HTMLDivElement

  window.scrollTo(SCROLL_TO_OPTIONS)
  tocElement.scrollTo(SCROLL_TO_OPTIONS)

  // Fixes https://github.com/facebook/react/issues/20770
  // Fixes https://github.com/shuding/nextra/issues/2917
  buttonElement.disabled = true
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
        'nextra-focus _flex _items-center _gap-1.5 _transition _opacity-100 disabled:_opacity-0',
        className
      )}
    >
      Scroll to top
      <ArrowRightIcon className="_h-4 _-rotate-90 _border _rounded-full _border-current" />
    </button>
  )
}
