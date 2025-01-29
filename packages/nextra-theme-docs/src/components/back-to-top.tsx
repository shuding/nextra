import cn from 'clsx'
import { Button } from 'nextra/components'
import { ArrowRightIcon } from 'nextra/icons'
import type { ComponentProps, FC, ReactNode } from 'react'

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

export const BackToTop: FC<{
  children: ReactNode
  className?: string
  hidden: boolean
}> = ({ children, className, hidden }) => {
  return (
    <Button
      // elements with `aria-hidden: true` must not be focusable or contain focusable elements
      aria-hidden={hidden ? 'true' : undefined}
      onClick={scrollToTop}
      disabled={hidden}
      className={({ disabled }) =>
        cn(
          'x:flex x:items-center x:gap-1.5',
          'x:whitespace-nowrap', // Safari
          disabled ? 'x:opacity-0' : 'x:opacity-100',
          className
        )
      }
    >
      {children}
      <ArrowRightIcon
        height="1.1em"
        className="x:-rotate-90 x:border x:rounded-full x:border-current"
      />
    </Button>
  )
}
