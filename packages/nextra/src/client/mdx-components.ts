'use no memo'

import type { ComponentPropsWithoutRef, FC, JSX } from 'react'
import type { MDXWrapper } from '../types.js'
import { Anchor } from './mdx-components/anchor.js'
import { Image } from './mdx-components/image.js'

interface NestedMDXComponents {
  [key: string]: NestedMDXComponents | FC<any> | keyof JSX.IntrinsicElements
}

export type MDXComponents = NestedMDXComponents & {
  [Key in Exclude<keyof JSX.IntrinsicElements, 'img'>]?:
    | FC<ComponentPropsWithoutRef<Key>>
    | keyof JSX.IntrinsicElements
} & {
  wrapper?: MDXWrapper
  img?: FC<ComponentPropsWithoutRef<typeof Image>>
}

export const useMDXComponents = <T extends Readonly<MDXComponents>>(
  components: T
) => {
  return {
    img: Image,
    a: Anchor,
    ...components
  } satisfies T
}
