import cn from 'clsx'
// eslint-disable-next-line no-restricted-imports -- only in this file we determine either we include <a /> as child of <NextLink />
import NextLink from 'next/link'
import type { ComponentProps, ReactElement } from 'react'
import { forwardRef } from 'react'

export type AnchorProps = ComponentProps<'a'> & {
  newWindow?: boolean
}

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  (
    { href = '', children, newWindow, ...props },
    // ref is used in <NavbarMenu />
    forwardedRef
  ): ReactElement => {
    const ComponentToUse = newWindow || href.startsWith('#') ? 'a' : NextLink
    return (
      <ComponentToUse
        {...props}
        className={cn('nextra-focus', props.className)}
        ref={forwardedRef}
        href={href}
        {...(newWindow && {
          target: '_blank',
          rel: 'noreferrer'
        })}
      >
        {children}
      </ComponentToUse>
    )
  }
)

Anchor.displayName = 'Anchor'
