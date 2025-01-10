/* eslint typescript-sort-keys/interface: error */
import type { ReadingTime } from 'nextra'

export type BlogMetadata = {
  author?: string
  date?: string
  description?: string
  readingTime?: ReadingTime
  tags?: []
  title?: string
}
