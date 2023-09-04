import path from 'node:path'
import slash from 'slash'
import title from 'title'
import type { Folder, MdxFile, Meta } from './types'

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T // from lodash

export function truthy<T>(value: T): value is Truthy<T> {
  return !!value
}

export function normalizeMeta(meta: Meta): Exclude<Meta, string> {
  return typeof meta === 'string' ? { title: meta } : meta
}

export function normalizePageRoute(parentRoute: string, route: string): string {
  return slash(path.join(parentRoute, route.replace(/^index$/, '')))
}

export function pageTitleFromFilename(fileName: string) {
  return title(fileName.replaceAll(/[-_]/g, ' '))
}

export function sortPages(
  pages: (
    | Pick<MdxFile, 'kind' | 'name' | 'frontMatter' | 'locale'>
    | Pick<Folder, 'kind' | 'name'>
  )[],
  locale?: string
): [string, string][] {
  if (locale === '') {
    locale = undefined
  }
  return pages
    .filter(item => item.kind === 'Folder' || item.locale === locale)
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
      return a.title.localeCompare(b.title, locale, { numeric: true })
    })
    .map(item => [item.name, item.title])
}

export function isSerializable(o: any): boolean {
  try {
    JSON.stringify(o)
    return true
  } catch (err) {
    return false
  }
}

/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {number} [seed] optionally pass the hash of the previous chunk
 * @returns {string}
 */
export function hashFnv32a(str: string, seed = 0x811c9dc5): string {
  let hval = seed

  for (let i = 0; i < str.length; i++) {
    hval ^= str.charCodeAt(i)
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
  }

  // Convert to 8 digit hex string
  return ('0000000' + (hval >>> 0).toString(16)).substring(-8)
}

export function getDefault<T>(module: T & { default?: T }): T {
  return module.default || module
}

export const logger = {
  info: console.log.bind(null, '- ', '\x1b[36minfo\x1b[0m', '[nextra]'),
  warn: console.log.bind(null, '- ', '\x1b[33mwarn\x1b[0m', '[nextra]'),
  error: console.log.bind(null, '- ', '\x1b[31mwarn\x1b[0m', '[nextra]')
}
