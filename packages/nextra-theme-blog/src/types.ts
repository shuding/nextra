/* eslint typescript-sort-keys/interface: error */
import type { ReadingTime } from 'nextra'

export type NextraBlogTheme =  {
  darkMode?: boolean
  dateFormatter?: (date: Date) => string
  navs?: {
    name: string
    url: string
  }[]
  readMore?: string
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
