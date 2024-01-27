/* eslint typescript-sort-keys/interface: error */
import type { ReadingTime } from 'nextra'
import type { ReactNode } from 'react'

export type NextraBlogTheme =  {
  darkMode?: boolean
  dateFormatter?: (date: Date) => string
  footer?: ReactNode
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
  readingTime?: ReadingTime
  tags?: []
  title?: string
}
