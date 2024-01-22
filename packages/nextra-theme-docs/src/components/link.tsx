import cn from 'clsx'
import type { AnchorProps } from './anchor'
import { Anchor } from './anchor'

const EXTERNAL_HREF_REGEX = /https?:\/\//

// TODO: use remark plugin which adds target="_blank" to external links
export const Link = ({ href = '', className, ...props }: AnchorProps) => (
  <Anchor
    href={href}
    newWindow={EXTERNAL_HREF_REGEX.test(href)}
    className={cn(
      '_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]',
      className
    )}
    {...props}
  />
)
