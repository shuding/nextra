import cn from 'clsx'
import { Anchor as _Anchor } from 'nextra/mdx'
import type { ComponentProps, FC } from 'react'

export const Anchor: FC<
  ComponentProps<'a'> & {
    newWindow?: boolean
  }
> = ({ newWindow, ...props }) => {
  return (
    <_Anchor
      {...props}
      className={cn('focus-visible:nextra-focus', props.className)}
      {...(newWindow && {
        target: '_blank',
        rel: 'noreferrer'
      })}
    />
  )
}
