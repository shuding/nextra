declare module 'github-slugger' {
  export default class Slugger {
    slug(data: string): string
  }
}

declare module 'rehype-mdx-title'

declare module globalThis {
  import { PageMapItem } from './types'
  var __nextra_internal__: {
    pageMap: PageMapItem[]
    route: string
  }
}
