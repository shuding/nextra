/*
 * ⚠️ Attention!
 * This file should be never used directly, only in loader.ts
 */

import type { ComponentProps, FC } from 'react'
import { createElement } from 'react'
import type { MDXWrapper, PageOpts, UseTOC } from '../types'
import type { useMDXComponents as _useMDXComponents } from './mdx.js'

export function HOC_MDXWrapper(
  MDXContent: MDXWrapper,
  useMDXComponents: typeof _useMDXComponents,
  useTOC: UseTOC,
  pageOpts: PageOpts
): FC<ComponentProps<MDXWrapper>> {
  return function MDXWrapper(props) {
    const { wrapper: Wrapper } = useMDXComponents()
    const children = createElement(MDXContent, props)

    return Wrapper ? (
      // eslint-disable-next-line react-hooks/rules-of-hooks
      <Wrapper toc={useTOC()} {...pageOpts}>
        {children}
      </Wrapper>
    ) : (
      children
    )
  }
}
