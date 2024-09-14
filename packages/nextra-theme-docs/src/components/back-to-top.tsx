import cn from 'clsx'
import { Button } from 'nextra/components'
import { ArrowRightIcon } from 'nextra/icons'
import type { ComponentProps, ReactElement } from 'react'

const SCROLL_TO_OPTIONS = { top: 0, behavior: 'smooth' } as const

const scrollToTop: ComponentProps<'button'>['onClick'] = event => {
  const buttonElement = event.currentTarget
  const tocElement = buttonElement.parentElement!.parentElement!

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
    <Button
      aria-hidden="true"
      onClick={scrollToTop}
      disabled={hidden}
      variant="default"
      className={({ disabled }) =>
        cn(
          '_flex _items-center _gap-1.5',
          disabled ? '_opacity-0' : '_opacity-100',
          className
        )
      }
    >
      Scroll to top
      <ArrowRightIcon
        height="16"
        className="_-rotate-90 _border _rounded-full _border-current"
      />
    </Button>
  )
}
