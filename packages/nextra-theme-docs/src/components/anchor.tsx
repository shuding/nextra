// eslint-disable-next-line no-restricted-imports -- only in this file we determine either we include <a /> as child of <NextLink />
import NextLink from 'next/link'
import type { ComponentProps, ReactElement } from 'react'
import { forwardRef } from 'react'
import cn from 'clsx'

export type AnchorProps = Omit<ComponentProps<'a'>, 'ref'> & {
  newWindow?: boolean
}

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  (
    { href = '', children, newWindow, className, ...props },
    // ref is used in <NavbarMenu />
    forwardedRef
  ): ReactElement => {
    if (newWindow) {
      return (
        <a
          ref={forwardedRef}
          href={href}
          className={cn(['nextra-focus-ring', className])}
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
      <NextLink ref={forwardedRef} href={href} className={cn(['nextra-focus-ring', className])} {...props}>
        {children}
      </NextLink>
    )
  }
)

Anchor.displayName = 'Anchor'
