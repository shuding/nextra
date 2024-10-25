/*
 * ⚠️ Attention!
 * This file should be never used directly, only in loader.ts
 */

import { useMDXComponents } from 'next-mdx-import-source-file'
import type { ComponentProps, FC } from 'react'
import { createElement } from 'react'
import type { Heading, MDXWrapper, PageOpts } from '../types'

export function HOC_MDXWrapper(
  MDXContent: MDXWrapper,
  hocProps: PageOpts & { toc: Heading[] }
): FC<ComponentProps<MDXWrapper>> {
  return function MDXWrapper(props) {
    const Wrapper = useMDXComponents().wrapper
    const children = createElement(MDXContent, props)

    return Wrapper ? <Wrapper {...hocProps}>{children}</Wrapper> : children
  }
}
