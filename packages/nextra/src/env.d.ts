declare module 'title' {
  export default function title(
    title: string,
    special?: {
      special: string[]
    }
  )
}

declare namespace globalThis {
  import type { PageMapItem, SearchResult } from './types'
  var __nextra_resolvePageMap: Record<string, () => Promise<PageMapItem[]>>
  var pagefind: {
    search: (query: string) => Promise<{ results: SearchResult[] }>
  }
}

declare module 'next/dist/compiled/webpack/webpack.js' {
  export { default as webpack, sources } from 'webpack'
}

declare module '*.svg' {
  import type { FC, SVGProps } from 'react'
  export const ReactComponent: FC<SVGProps<SVGSVGElement>>
}
