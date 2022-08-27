declare module 'title' {
  export default function title(
    title: string,
    special?: {
      special: string[]
    }
  )
}

declare module globalThis {
  import { Context } from './types'
  var __nextra_pageContext__: {
    [route: string]: Context
  }
}
