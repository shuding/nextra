/*
 * ⚠️ Attention!
 * This file should be never used directly, only in loader.ts
 */

import type { FC, ReactElement } from 'react'
import { createElement } from 'react'
import type { MDXWrapper, PageOpts, UseTOC } from '../types'
import type { UseMDXComponents } from './mdx.js'

export function HOC_MDXWrapper(
  MDXContent: MDXWrapper,
  useMDXComponents: UseMDXComponents,
  useTOC: UseTOC,
  pageOpts: PageOpts
): FC {
  return function MDXWrapper(props): ReactElement {
    const { wrapper: Wrapper } = useMDXComponents()
    // @ts-expect-error -- fixme
    const children = createElement(MDXContent, props)

    return Wrapper ? (
      // @ts-expect-error -- fixme
      // eslint-disable-next-line react-hooks/rules-of-hooks
      <Wrapper toc={useTOC()} {...pageOpts}>
        {children}
      </Wrapper>
    ) : (
      children
    )
  }
}
