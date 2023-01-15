import { PageMapItem } from './types'

declare module 'title' {
  export default function title(
    title: string,
    special?: {
      special: string[]
    }
  )
}

declare global {
  function __nextra_temp_do_not_use(): void

  function __nextra_resolvePageMap(): Promise<PageMapItem[]>
}
