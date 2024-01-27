/* eslint typescript-sort-keys/interface: error */
import type { ReadingTime } from 'nextra'

export type BlogFrontMatter = {
  author?: string
  date?: Date
  description?: string
  draft?: boolean
  readingTime?: ReadingTime
  tags?: []
  title?: string
}
