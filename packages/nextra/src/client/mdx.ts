import type { useMDXComponents as originalUseMDXComponents } from '@mdx-js/react'
import type { MDXComponents } from '@mdx-js/react/lib'
import Image, { type ImageProps } from 'next/image'
import { createElement } from 'react'

export const DEFAULT_COMPONENTS = {
  img: props =>
    createElement(
      typeof props.src === 'object' ? Image : 'img',
      props as ImageProps
    )
} satisfies MDXComponents

export type UseMDXComponents = typeof originalUseMDXComponents

export const useMDXComponents: UseMDXComponents = components => {
  return {
    ...DEFAULT_COMPONENTS,
    ...components
  }
}

export type { MDXComponents }
