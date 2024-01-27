/* eslint typescript-sort-keys/interface: error */
import type { ReadingTime } from 'nextra'

export type NextraBlogTheme = {
  dateFormatter?: (date: Date) => string
}

export type BlogFrontMatter = {
  author?: string
  date?: Date
  description?: string
  draft?: boolean
  readingTime?: ReadingTime
  tags?: []
  title?: string
}
