import cn from 'clsx'
import { Anchor } from '../components'
import type { AnchorProps } from '../components/anchor'

const EXTERNAL_HREF_REGEX = /^https?:\/\//

// TODO: use remark plugin which adds target="_blank" to external links
export const Link = ({
  href = '',
  newWindow = EXTERNAL_HREF_REGEX.test(href),
  className,
  ...props
}: AnchorProps) => (
  <Anchor
    href={href}
    newWindow={newWindow}
    className={cn(
      '_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]',
      className
    )}
    {...props}
  />
)
