import {
  MDXContext,
  useMDXComponents as originalUseMDXComponents
} from '@mdx-js/react'
import type { Components } from '@mdx-js/react/lib'
import { MathJax } from 'better-react-mathjax'
import Image, { type ImageProps } from 'next/image'
import { createElement } from 'react'
import type { ComponentProps } from 'react'

const DEFAULT_COMPONENTS = {
  img: props =>
    createElement(
      typeof props.src === 'object' ? Image : 'img',
      props as ImageProps
    ),
  MathJax: (props: ComponentProps<typeof MathJax>) =>
    createElement(MathJax, props)
} satisfies Components

export const useMDXComponents: typeof originalUseMDXComponents = components => {
  return originalUseMDXComponents({
    ...DEFAULT_COMPONENTS,
    ...components
  })
}

export { MDXProvider } from '@mdx-js/react'

export type { Components }

MDXContext.displayName = 'MDX'
