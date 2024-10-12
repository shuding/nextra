declare module '*.mdx' {
  import type { FC } from 'react'
  import type { MDXComponents } from 'nextra/mdx'
  const ReactComponent: FC<{
    components?: MDXComponents
  }>
  export default ReactComponent
}

declare module '.next/static/chunks/nextra-page-map-*.mjs' {
  import type { PageMapItem } from 'nextra'
  export const pageMap: PageMapItem[]
}
