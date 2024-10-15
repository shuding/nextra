import type { MDXComponents as _MDXComponents } from '@mdx-js/react/lib'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import { ComponentProps, createElement } from 'react'
import type { MDXWrapper } from '../types'

export type MDXComponents = Omit<_MDXComponents, 'wrapper'> & {
  wrapper?: MDXWrapper
}

const EXTERNAL_HREF_RE = /^https?:\/\//

export const Anchor = ({ href = '', ...props }: ComponentProps<'a'>) => {
  if (EXTERNAL_HREF_RE.test(href)) {
    return <a href={href} target="_blank" rel="noreferrer" {...props} />
  }
  const ComponentToUse = href.startsWith('#') ? 'a' : Link
  return <ComponentToUse href={href} {...props} />
}

export function useMDXComponents(components?: MDXComponents) {
  return {
    // @ts-expect-error -- fix me
    img: props =>
      createElement(
        typeof props.src === 'object' ? Image : 'img',
        props as ImageProps
      ),
    a: Anchor,
    ...components
  }
}
