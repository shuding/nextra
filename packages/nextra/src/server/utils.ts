import path from 'path'
import slash from 'slash'
import title from 'title'
import type { Folder, MdxFile } from '../types'

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T // from lodash

export function truthy<T>(value: T): value is Truthy<T> {
  return !!value
}

export const logger = {
  info: console.log.bind(null, '-', '\x1b[36minfo\x1b[0m', '[nextra]'),
  warn: console.log.bind(null, '-', '\x1b[33mwarn\x1b[0m', '[nextra]'),
  error: console.log.bind(null, '-', '\x1b[31merror\x1b[0m', '[nextra]')
}

export function pageTitleFromFilename(fileName: string) {
  return title(fileName.replaceAll(/[-_]/g, ' '))
}

export function sortPages(
  pages: (Omit<MdxFile, 'route'> | Omit<Folder, 'route' | 'children'>)[],
  locale?: string
): [string, string][] {
  return pages
    .map(item => ({
      name: item.name,
      date: 'frontMatter' in item && item.frontMatter?.date,
      title:
        ('frontMatter' in item && item.frontMatter?.title) ||
        pageTitleFromFilename(item.name)
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
      return a.title.localeCompare(b.title, locale || undefined, {
        numeric: true
      })
    })
    .map(item => [item.name, item.title])
}

export function normalizePageRoute(parentRoute: string, route: string): string {
  return slash(path.join(parentRoute, route.replace(/^index$/, '')))
}
