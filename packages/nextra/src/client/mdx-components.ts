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

/**
 * Get current MDX components.
 * @returns The current set of MDX components
 */
export const useMDXComponents = <T extends Readonly<MDXComponents>>(
  /**
   * An object where:
   * - The key is the name of the HTML element to override.
   * - The value is the component to render instead.
   * @remarks `MDXComponents`
   */
  components: T
): T => {
  return {
    img: ImageZoom,
    a: Anchor,
    ...components
  } satisfies T
}
