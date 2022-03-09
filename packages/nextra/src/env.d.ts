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
