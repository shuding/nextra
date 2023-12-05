/* eslint typescript-sort-keys/interface: error */

export type SearchResult = {
  data: () => Promise<PagefindResult>
  id: string
}

export type PagefindResult = {
  excerpt: string
  meta: {
    title: string
  }
  raw_url: string
  sub_results: {
    excerpt: string
    title: string
    url: string
  }[]
  url: string
}
