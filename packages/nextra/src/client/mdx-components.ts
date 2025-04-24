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
} & DefaultMdxComponents

type DefaultMdxComponents = {
  /**
   * Nextra's `<ImageZoom />` component with zoom functionality.
   * Uses `<NextImage>` for static images and falls back to a standard `<img>` element for others.
   */
  img?: typeof ImageZoom
  /**
   * Nextra's `<Anchor />` component for rendering links.
   * Uses `<NextLink>` for internal navigation and falls back to a regular `<a>` element for
   * external links.
   */
  a?: typeof Anchor
}

const DEFAULT_COMPONENTS = {
  img: ImageZoom,
  a: Anchor
} satisfies DefaultMdxComponents

/**
 * Get current MDX components.
 * @returns The current set of MDX components.
 */
export type UseMDXComponents<
  /**
   * Default MDX components
   */
  DefaultMDXComponents extends MDXComponents
> = {
  <components extends MDXComponents>(
    /**
     * An object where:
     * - The key is the name of the HTML element to override.
     * - The value is the component to render instead.
     * @remarks `MDXComponents`
     */
    components: components
  ): DefaultMDXComponents & components
  (): DefaultMDXComponents
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
