import cn from 'clsx'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, FC } from 'react'
import { EXTERNAL_URL_RE } from '../../server/constants.js'
import { LinkArrowIcon } from '../icons/index.js'

type NextLinkProps = ComponentPropsWithoutRef<typeof Link>

type Props = Omit<NextLinkProps, 'href'> & {
  href?: NextLinkProps['href'] | undefined
}

export const Anchor: FC<Props> = ({ href = '', prefetch, ...props }) => {
  props = {
    ...props,
    className: cn('x:focus-visible:nextra-focus', props.className)
  }
  if (typeof href === 'string') {
    if (href.startsWith('#')) {
      return <a href={href} {...props} />
    }
    if (EXTERNAL_URL_RE.test(href)) {
      const { children } = props
      return (
        <a href={href} target="_blank" rel="noreferrer" {...props}>
          {children}
          {typeof children === 'string' && (
            <>
              &nbsp;
              <LinkArrowIcon
                // based on font-size
                height="1em"
                className="x:inline x:align-baseline x:shrink-0"
              />
            </>
          )}
        </a>
      )
    }
  }
  return <Link href={href} prefetch={prefetch} {...props} />
}
