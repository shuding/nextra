import type { PageMapItem } from './types'

declare global {
  function __nextra_temp_do_not_use(): void

  function __nextra_resolvePageMap(): Promise<PageMapItem[]>
}
