/*
 * ⚠️ Attention!
 * This file should be never used directly, only in loader.ts
 */

import { useMDXComponents as getMDXComponents } from 'next-mdx-import-source-file'
import type { ComponentProps, FC } from 'react'
import { createElement } from 'react'
import type { Heading, MDXWrapper, PageOpts } from '../types'

const Wrapper = getMDXComponents().wrapper

export function HOC_MDXWrapper(
  MDXContent: MDXWrapper,
  hocProps: PageOpts & { toc: Heading[] }
): FC<ComponentProps<MDXWrapper>> {
  return function MDXWrapper(props) {
    const children = createElement(MDXContent, props)

    return Wrapper ? <Wrapper {...hocProps}>{children}</Wrapper> : children
  }
}
