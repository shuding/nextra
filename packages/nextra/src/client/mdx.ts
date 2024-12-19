import { useMDXComponents as originalUseMDXComponents } from '@mdx-js/react'
import { type ImageProps } from 'next/image'
import { createElement } from 'react'
import { ImageZoom } from './components/image-zoom.js'

type MDXComponents = ReturnType<typeof originalUseMDXComponents>

const DEFAULT_COMPONENTS = {
  img: props => createElement(ImageZoom, props as ImageProps)
} satisfies MDXComponents

export const useMDXComponents: typeof originalUseMDXComponents = components => {
  return {
    ...DEFAULT_COMPONENTS,
    ...originalUseMDXComponents(components)
  }
}

export { MDXProvider } from '@mdx-js/react'

export type { MDXComponents }
