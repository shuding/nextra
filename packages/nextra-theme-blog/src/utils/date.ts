import type { MdxFile } from 'nextra'

export const sortDate = (a: MdxFile, b: MdxFile): number => {
  if (!a.frontMatter?.date || !b.frontMatter?.date) return -1

  return (
    new Date(b.frontMatter.date).getTime() -
    new Date(a.frontMatter.date).getTime()
  )
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?(:\d{2}\.\d{3}Z)?$/
const DATE_REGEX_WITH_SLASH = /^\d{4}\/\d{1,2}\/\d{1,2}( \d{1,2}:\d{1,2})?$/

export const isValidDate = (date: string): boolean =>
  DATE_REGEX.test(date) || DATE_REGEX_WITH_SLASH.test(date)
