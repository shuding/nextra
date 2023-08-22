import { useMDXComponents as originalUseMDXComponents } from '@mdx-js/react'
import type { Components } from '@mdx-js/react/lib'
import Image, { type ImageProps } from 'next/image'

const DEFAULT_COMPONENTS = {
  img: props =>
    typeof props.src === 'object' ? (
      <Image {...(props as ImageProps)} />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img {...props} />
    )
} satisfies Components

export const useMDXComponents: typeof originalUseMDXComponents = components => {
  return originalUseMDXComponents({
    ...DEFAULT_COMPONENTS,
    ...components
  })
}

export { MDXProvider } from '@mdx-js/react'
export type { Components }
