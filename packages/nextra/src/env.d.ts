declare module globalThis {
  import { PageMapItem } from './types'
  var __nextra_internal__: {
    pageMap: PageMapItem[]
    route: string
  }
}

declare module 'title' {
  export default function title(
    title: string,
    special?: {
      special: string[]
    }
  )
}
