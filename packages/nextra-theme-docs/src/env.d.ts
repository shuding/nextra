declare namespace globalThis {
  import type { SearchResult } from './types'
  var pagefind: {
    search: (query: string) => Promise<{
      results: SearchResult[]
    }>
  }
}
