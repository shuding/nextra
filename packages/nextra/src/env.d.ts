declare module 'title' {
  export default function title(
    title: string,
    special?: {
      special: string[]
    }
  )
}

declare namespace globalThis {
  import type { PageMapItem } from './types'
  var __nextra_resolvePageMap: Record<string, () => Promise<PageMapItem[]>>
}

declare module 'next/dist/compiled/webpack/webpack.js' {
  export { default as webpack, sources } from 'webpack'
}

declare module '*.svg' {
  import { ReactElement } from 'react'
  import type { ComponentPropsWithRef } from 'react'

  export const ReactComponent = (_props: ComponentPropsWithRef<'svg'>) => ReactElement
}
