// eslint-disable-next-line no-restricted-imports -- only in this file we determine either we include <a /> as child of <NextLink />
import NextLink from 'next/link'
import type { ComponentProps, ReactElement } from 'react'
import { forwardRef } from 'react'

export type AnchorProps = Omit<ComponentProps<'a'>, 'ref'> & {
  newWindow?: boolean
}

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  (
    { href = '', children, newWindow, ...props },
    // ref is used in <NavbarMenu />
    forwardedRef
  ): ReactElement => {
    if (newWindow) {
      return (
        <a
          ref={forwardedRef}
          href={href}
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </a>
      )
    }

    if (!href) {
      return (
        <a ref={forwardedRef} {...props}>
          {children}
        </a>
      )
    }

    return (
      <NextLink ref={forwardedRef} href={href} {...props}>
        {children}
      </NextLink>
    )
  }
)

Anchor.displayName = 'Anchor'
