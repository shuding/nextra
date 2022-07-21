declare module 'slash' {
  export default function slash(path: string): string
}

declare module 'download' {
  export default function dwonload(url: string, path: string): Promise<void>
}

declare module 'github-slugger' {
  export default class Slugger {
    slug(data: string): string
  }
}

declare module globalThis {
  import { PageMapItem } from './types'
  var __nextra_internal__: {
    pageMap: PageMapItem[]
    route: string
  }
}
