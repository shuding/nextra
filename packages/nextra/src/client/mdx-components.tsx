import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import { createElement } from 'react'
import type { ComponentProps, FC, JSX } from 'react'
import { EXTERNAL_URL_RE } from '../server/constants.js'
import type { MDXWrapper } from '../types.js'
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

export const Anchor: FC<ComponentProps<'a'>> = ({ href = '', ...props }) => {
  if (EXTERNAL_URL_RE.test(href)) {
    const { children } = props
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
        {typeof children === 'string' && (
          <>
            &thinsp;
            <LinkArrowIcon
              height="16"
              className="_inline _align-baseline _shrink-0"
            />
          </>
        )}
      </a>
    )
  }
  const ComponentToUse = href.startsWith('#') ? 'a' : Link
  return <ComponentToUse href={href} {...props} />
}

export function useMDXComponents(components?: Readonly<MDXComponents>) {
  return {
    img(props) {
      if (
        process.env.NODE_ENV !== 'production' &&
        typeof props.src === 'object' &&
        !('blurDataURL' in props.src)
      ) {
        console.warn(
          `[nextra] Failed to load blur image "${(props.src as any).src}" due missing "src.blurDataURL" value.
This is Turbopack bug, which will not occurs on production (since Webpack is used for "next build" command).`
        )
        props = {
          ...props,
          // @ts-expect-error
          placeholder: 'empty'
        }
      }
      return createElement(
        typeof props.src === 'object' ? Image : 'img',
        props as ImageProps
      )
    },
    a: Anchor,
    ...components
  } satisfies MDXComponents
}
