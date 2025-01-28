'use client'

import cn from 'clsx'
import Link from 'next/link'
import {
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type FC
} from 'react'
import { LinkArrowIcon } from '../icons/index.js'

const isExternalUrl = (href: string) => {
  try {
    const url = new URL(href, window.location.origin)
    return url.hostname !== window.location.hostname
  } catch {
    return false
  }
}

export const Anchor: FC<ComponentPropsWithoutRef<'a'>> = ({
  href = '',
  ...props
}) => {
  const { children } = props
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const combinedProps = {
    ...props,
    className: cn('x:focus-visible:nextra-focus', props.className)
  }

  if (isClient && isExternalUrl(href)) {
    return (
      <Link href={href} target="_blank" rel="noreferrer" {...combinedProps}>
        {children}
        {typeof children === 'string' && (
          <>
            &thinsp;
            <LinkArrowIcon
              // based on font-size
              height="1em"
              className="x:inline x:align-baseline x:shrink-0"
            />
          </>
        )}
      </Link>
    )
  }

  return (
    <Link href={href} {...combinedProps}>
      {children}
    </Link>
  )
}
