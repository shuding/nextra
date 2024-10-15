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
  import type { FC, SVGProps } from 'react'
  export const ReactComponent: FC<SVGProps<SVGSVGElement>>
}

declare module 'next/dist/esm/client/add-base-path.js' {
  export * from 'next/dist/client/add-base-path'
}
