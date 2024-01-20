import type { useMDXComponents as originalUseMDXComponents } from '@mdx-js/react'
import type { MDXComponents } from '@mdx-js/react/lib'
import Image, { type ImageProps } from 'next/image'
import { createElement } from 'react'

const DEFAULT_COMPONENTS = {
  img: props =>
    createElement(
      typeof props.src === 'object' ? Image : 'img',
      props as ImageProps
    )
} satisfies MDXComponents

export const useMDXComponents: typeof originalUseMDXComponents = components => {
  return {
    ...DEFAULT_COMPONENTS,
    ...components
  }
}

export type { MDXComponents }
