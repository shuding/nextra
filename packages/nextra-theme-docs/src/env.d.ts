declare module 'github-slugger' {
  export default class Slugger {
    slug(data: string): string
  }
}

declare module 'match-sorter'

declare module 'title' {
  export default function title(
    title: string,
    special?: {
      special: string[]
    }
  )
}
