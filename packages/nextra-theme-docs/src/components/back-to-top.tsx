import cn from 'clsx'
import { Button } from 'nextra/components'
import { ArrowRightIcon } from 'nextra/icons'
import type { ComponentProps, ReactElement, ReactNode } from 'react'

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
  children,
  className,
  hidden
}: {
  children: ReactNode
  className?: string
  hidden: boolean
}): ReactElement {
  return (
    <Button
      // elements with `aria-hidden: true` must not be focusable or contain focusable elements
      aria-hidden={hidden ? 'true' : undefined}
      onClick={scrollToTop}
      disabled={hidden}
      className={({ disabled }) =>
        cn(
          '_flex _items-center _gap-1.5',
          '_whitespace-nowrap', // Safari
          disabled ? '_opacity-0' : '_opacity-100',
          className
        )
      }
    >
      {children}
      <ArrowRightIcon
        height="16"
        className="_-rotate-90 _border _rounded-full _border-current"
      />
    </Button>
  )
}
