import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import { createElement } from 'react'
import type { ComponentProps, FC, JSX } from 'react'
import type { MDXWrapper } from '../types'
import { LinkArrowIcon } from './icons/index.js'

interface NestedMDXComponents {
  [key: string]: NestedMDXComponents | FC<any> | keyof JSX.IntrinsicElements
}

export type MDXComponents = NestedMDXComponents & {
  [Key in keyof JSX.IntrinsicElements]?:
    | FC<ComponentProps<Key>>
    | keyof JSX.IntrinsicElements
} & {
  wrapper?: MDXWrapper
}

const EXTERNAL_HREF_RE = /^https?:\/\//

export const Anchor: FC<ComponentProps<'a'>> = ({ href = '', ...props }) => {
  if (EXTERNAL_HREF_RE.test(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {props.children}
        <LinkArrowIcon
          height="16"
          className="_inline _ps-0.5 _align-baseline"
        />
      </a>
    )
  }
  const ComponentToUse = href.startsWith('#') ? 'a' : Link
  return <ComponentToUse href={href} {...props} />
}

export function useMDXComponents(components?: Readonly<MDXComponents>) {
  return {
    img: props =>
      createElement(
        typeof props.src === 'object' ? Image : 'img',
        props as ImageProps
      ),
    a: Anchor,
    ...components
  } satisfies MDXComponents
}
