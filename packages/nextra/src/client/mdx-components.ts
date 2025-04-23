import type { ComponentPropsWithoutRef, FC, JSX } from 'react'
import type { MDXWrapper } from '../types.js'
import { ImageZoom } from './components/image-zoom.js'
import { Anchor } from './mdx-components/anchor.js'

/**
 * A valid JSX string component.
 */
type StringComponent = Exclude<keyof JSX.IntrinsicElements, 'img' | 'a'>

/**
 * Any allowed JSX component.
 */
type Component<Props> = FC<Props> | StringComponent

export interface NestedMDXComponents {
  [key: string]: NestedMDXComponents | Component<any>
}

/**
 * MDX components may be passed as the `components`.
 *
 * The key is the name of the element to override. The value is the component to render instead.
 */
export type MDXComponents = NestedMDXComponents & {
  [Key in StringComponent]?: FC<ComponentPropsWithoutRef<Key>>
} & {
  /**
   * If a wrapper component is defined, the MDX content will be wrapped inside it.
   */
  wrapper?: MDXWrapper
  img?: typeof ImageZoom
  a?: typeof Anchor
}

const DEFAULT_COMPONENTS = {
  img: ImageZoom,
  a: Anchor
}

/**
 * Get current MDX components.
 * @returns The current set of MDX components.
 */
export type UseMDXComponents<
  /**
   * Default MDX components
   */
  DC extends MDXComponents
> = {
  <T extends MDXComponents>(
    /**
     * An object where:
     * - The key is the name of the HTML element to override.
     * - The value is the component to render instead.
     * @remarks `MDXComponents`
     */
    components: T
  ): DC & T
  (): DC
}

export const useMDXComponents: UseMDXComponents<typeof DEFAULT_COMPONENTS> = <
  T
>(
  components?: T
) => {
  return {
    ...DEFAULT_COMPONENTS,
    ...components
  }
}
