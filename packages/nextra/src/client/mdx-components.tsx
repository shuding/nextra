import type { ComponentPropsWithoutRef, FC, JSX } from 'react'
import type { MDXWrapper } from '../types.js'
import { Anchor } from './components/anchor.js'
import { Image } from './components/image.js'

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

export function useMDXComponents(components?: Readonly<MDXComponents>) {
  return {
    img: Image,
    a: Anchor,
    ...components
  } satisfies MDXComponents
}
