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

  var __nextra_temp_do_not_use: () => void

  var __nextra_resolvePageMap: Record<string, () => Promise<PageMapItem[]>>
}

declare module 'next/dist/compiled/webpack/webpack.js' {
  export { default as webpack, sources } from 'webpack'
}
