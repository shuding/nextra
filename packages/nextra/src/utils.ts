import path from 'node:path'
import { LOCALE_REGEX } from './constants'
import { Meta } from './types'

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

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T // from lodash

export function truthy<T>(value: T): value is Truthy<T> {
  return !!value
}

export function normalizeMeta(meta: Meta): Exclude<Meta, string> {
  return typeof meta === 'string' ? { title: meta } : meta
}
