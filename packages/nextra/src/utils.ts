import path from 'node:path'
import slash from 'slash'
import type { Folder, MdxFile, Meta, MetaJsonFile, PageMapItem } from './types'

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

export function isSerializable(o: any): boolean {
  try {
    JSON.stringify(o)
    return true
  } catch (err) {
    return false
  }
}

export function getDefault<T>(module: T & { default?: T }): T {
  return module.default || module
}

export function isMeta(item: PageMapItem): item is MetaJsonFile {
  return 'data' in item
}

export function isFolder(item: PageMapItem): item is Folder {
  return 'children' in item
}

export function isMdxFile(item: PageMapItem): item is MdxFile {
  return 'route' in item && !('children' in item)
}
