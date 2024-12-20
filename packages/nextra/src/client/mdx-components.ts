import type { ComponentPropsWithoutRef, FC, JSX } from 'react'
import type { MDXWrapper } from '../types.js'
import { ImageZoom } from './components/image-zoom.js'
import { Anchor } from './mdx-components/anchor.js'

interface NestedMDXComponents {
  [key: string]: NestedMDXComponents | FC<any> | keyof JSX.IntrinsicElements
}

export type MDXComponents = NestedMDXComponents & {
  [Key in Exclude<keyof JSX.IntrinsicElements, 'img'>]?:
    | FC<ComponentPropsWithoutRef<Key>>
    | keyof JSX.IntrinsicElements
} & {
  wrapper?: MDXWrapper
  img?: FC<ComponentPropsWithoutRef<typeof ImageZoom>>
}

export const useMDXComponents = <T extends Readonly<MDXComponents>>(
  components: T
) => {
  return {
    img: ImageZoom,
    a: Anchor,
    ...components
  } satisfies T
}
