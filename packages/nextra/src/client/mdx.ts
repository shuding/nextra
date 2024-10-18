import { useMDXComponents as originalUseMDXComponents } from '@mdx-js/react'
import Image, { type ImageProps } from 'next/image'
import { createElement } from 'react'

type MDXComponents = ReturnType<typeof originalUseMDXComponents>

const DEFAULT_COMPONENTS = {
  img: props =>
    createElement(
      typeof props.src === 'object' ? Image : 'img',
      props as ImageProps
    )
} satisfies MDXComponents

export const useMDXComponents: typeof originalUseMDXComponents = components => {
  return originalUseMDXComponents({
    ...DEFAULT_COMPONENTS,
    ...components
  })
}

export { MDXProvider } from '@mdx-js/react'

export type { MDXComponents }
