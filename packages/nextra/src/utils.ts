import path from 'node:path'
import title from 'title'
import { LOCALE_REGEX } from './constants'
import { Folder, MdxFile, Meta } from './types'

export function parseFileName(filePath: string): {
  name: string
  locale: string
  ext: string
} {
  // Get file name and extension from file path
  const { name, ext } = path.parse(filePath)
  const locale = name.match(LOCALE_REGEX)?.[1] || ''
  return {
    name: locale ? name.replace(LOCALE_REGEX, '') : name,
    locale,
    ext
  }
}

export const parseJsonFile = (
  content: string,
  path: string
): Record<string, any> => {
  try {
    return JSON.parse(content)
  } catch (err) {
    console.error(
      `[nextra] Error parsing ${path}, make sure it's a valid JSON`,
      err
    )
    return {}
  }
}

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T // from lodash

export function truthy<T>(value: T): value is Truthy<T> {
  return !!value
}

export function normalizeMeta(meta: Meta): Exclude<Meta, string> {
  return typeof meta === 'string' ? { title: meta } : meta
}

export function sortPages(
  pages: (
    | Pick<MdxFile, 'kind' | 'name' | 'frontMatter' | 'locale'>
    | Pick<Folder, 'kind' | 'name'>
  )[],
  locale?: string
): [string, string][] {
  return pages
    .filter(item => item.kind === 'Folder' || item.locale === locale)
    .map(item => ({
      name: item.name,
      date: 'frontMatter' in item && item.frontMatter?.date,
      title:
        ('frontMatter' in item && item.frontMatter?.title) ||
        title(item.name.replace(/[-_]/g, ' '))
    }))
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      if (a.date) {
        return -1 // sort a before b
      }
      if (b.date) {
        return 1 // sort a after b
      }
      return a.title.localeCompare(b.title, locale, { numeric: true })
    })
    .map(item => [item.name, item.title])
}
