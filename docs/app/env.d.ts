declare module '*.svg?svgr' {
  import type { FC, SVGProps } from 'react'
  const ReactComponent: FC<SVGProps<SVGElement>>

  export default ReactComponent
}

declare module '*.mdx' {
  import type { FC } from 'react'
  import type { MDXComponents } from 'nextra/mdx-components'
  const ReactComponent: FC<{
    components?: MDXComponents
  }>
  export default ReactComponent
}
