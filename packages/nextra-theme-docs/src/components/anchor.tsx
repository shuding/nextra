import React, { forwardRef, ComponentProps, ReactElement } from 'react'
// eslint-disable-next-line no-restricted-imports -- only in this file we determine either we include <a /> as child of <NextLink /> based of `newNextLinkBehavior` value
import NextLink from 'next/link'
import { useConfig } from '../contexts'

type AnchorProps = Omit<ComponentProps<'a'>, 'ref'> & {
  newWindow?: boolean
}

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(function (
  { href = '', children, newWindow, ...props },
  // ref is used in <NavbarMenu />
  forwardedRef
): ReactElement {
  const config = useConfig()

  if (newWindow) {
    return (
      <a
        ref={forwardedRef}
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-selected={false}
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

  if (config.newNextLinkBehavior) {
    return (
      <NextLink ref={forwardedRef} href={href} {...props}>
        {children}
      </NextLink>
    )
  }

  return (
    <NextLink href={href} passHref>
      <a ref={forwardedRef} {...props}>
        {children}
      </a>
    </NextLink>
  )
})
