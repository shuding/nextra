import cn from 'clsx'
import { Code, Pre } from 'nextra/components'
import type { MDXComponents } from 'nextra/mdx'
import { Anchor } from './components'
import type { AnchorProps } from './components/anchor'

const EXTERNAL_HREF_REGEX = /https?:\/\//

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

const DEFAULT_COMPONENTS: MDXComponents = {
  a: Link,
  pre: Pre,
  code: Code
}
