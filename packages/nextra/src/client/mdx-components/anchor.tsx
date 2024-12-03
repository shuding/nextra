import cn from 'clsx'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, FC } from 'react'
import { EXTERNAL_URL_RE } from '../../server/constants.js'
import { LinkArrowIcon } from '../icons/index.js'

export const Anchor: FC<ComponentPropsWithoutRef<'a'>> = ({
  href = '',
  ...props
}) => {
  props = {
    ...props,
    className: cn('x:focus-visible:nextra-focus', props.className)
  }
  if (EXTERNAL_URL_RE.test(href)) {
    const { children } = props
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
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
      </a>
    )
  }
  const ComponentToUse = href.startsWith('#') ? 'a' : Link
  return <ComponentToUse href={href} {...props} />
}
