import cn from 'clsx'
import { Anchor } from 'nextra/mdx'

export const Link: typeof Anchor = ({ className, ...props }) => (
  <Anchor
    className={cn(
      '_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]',
      className
    )}
    {...props}
  />
)
