// eslint-disable-next-line no-restricted-imports -- only in this file we determine either we include <a /> as child of <NextLink />
import cn from 'clsx'
import NextLink from 'next/link'
import type { ComponentProps, ReactElement } from 'react'
import { forwardRef } from 'react'

export type AnchorProps = Omit<ComponentProps<'a'>, 'ref'> & {
  newWindow?: boolean
}

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  (
    { href = '', children, newWindow, className: _className, ...props },
    // ref is used in <NavbarMenu />
    forwardedRef
  ): ReactElement => {
    const className = cn('nextra-focus', _className)
    if (newWindow) {
      return (
        <a
          ref={forwardedRef}
          href={href}
          target="_blank"
          rel="noreferrer"
          {...props}
          className={className}
        >
          {children}
        </a>
      )
    }
    return (
      <NextLink ref={forwardedRef} href={href} {...props} className={className}>
        {children}
      </NextLink>
    )
  }
)

Anchor.displayName = 'Anchor'
