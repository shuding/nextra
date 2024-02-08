import type { useMDXComponents as originalUseMDXComponents } from '@mdx-js/react'
import type { MDXComponents as _MDXComponents } from '@mdx-js/react/lib'
import Image, { type ImageProps } from 'next/image'
import { createElement } from 'react'
import type { MDXWrapper } from '../types'

export const DEFAULT_COMPONENTS = {
  img: props =>
    createElement(
      typeof props.src === 'object' ? Image : 'img',
      props as ImageProps
    )
} satisfies _MDXComponents

export type UseMDXComponents = typeof originalUseMDXComponents

export const useMDXComponents: UseMDXComponents = components => {
  return {
    ...DEFAULT_COMPONENTS,
    ...components
  }
}

export type MDXComponents = Omit<_MDXComponents, 'wrapper'> & {
  wrapper?: MDXWrapper
}
