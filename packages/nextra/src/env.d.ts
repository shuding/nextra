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
  var pagefind: {
    search: <T>(query: string) => Promise<{
      results: {
        data: () => Promise<T>
        id: string
      }[]
    }>
    options: (opts: Record<string, unknown>) => Promise<void>
  }
}

declare module '*.svg' {
  import type { FC, SVGProps } from 'react'
  export const ReactComponent: FC<SVGProps<SVGSVGElement>>
}
