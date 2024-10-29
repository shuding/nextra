import path from 'path'
import fg from 'fast-glob'
import slash from 'slash'
import type { Folder, MdxFile } from '../types'

type Params = {
  dir: string
  cwd?: string
  isAppDir?: boolean
}

export async function getFilepaths({
  dir: _dir,
  cwd,
  isAppDir
}: Params): Promise<string[]> {
  if (!_dir) {
    throw new Error('`dir` is required')
  }
  const dir = slash(_dir)
  const result = await fg(
    [
      `${dir}/**/${isAppDir ? 'page.{js,jsx,jsx,tsx,md,mdx}' : '*.{md,mdx}'}`,
      `${dir}/**/_meta.{js,jsx,ts,tsx}`
    ],
    { cwd }
  )
  const relativePaths = result
    .map(r => slash(path.relative(dir, r)))
    // sort filepaths alphabetically
    .sort((a, b) => a.localeCompare(b))
  return relativePaths
}

export function generatePageMapFromFilepaths(
  filepaths: string[],
  basePath = ''
): any {
  const mdxPages: Record<string, string> = Object.create(null)
  const metaFiles: Record<string, string> = Object.create(null)
  const sortedPaths = filepaths.toSorted((a, b) => {
    if (a.startsWith('index.')) {
      return -1
    }
    return a.localeCompare(b)
  })
  for (const r of sortedPaths) {
    const pathInfo = path.parse(r)

    if (pathInfo.name === 'page') {
      mdxPages[pathInfo.dir.replace(/\(.*\)\//, '')] = r
    } else if (pathInfo.name === '_meta') {
      metaFiles[`${pathInfo.dir}/_meta`.replace(/^\//, '')] = r
    } else {
      const key = `${pathInfo.dir}/${pathInfo.name}`
        .replace(/\/index$/, '')
        .replace(/^\//, '')
      mdxPages[key] = r
    }
  }

  const obj = Object.create(null)

  for (const path of Object.keys(metaFiles)) {
    const resultKey = [basePath, path].filter(Boolean).join('/')
    resultKey.split('/').reduce((r, e) => (r[e] ||= {}), obj)
  }
  for (const path of Object.keys(mdxPages)) {
    const resultKey = [basePath, path, 'index'].filter(Boolean).join('/')
    resultKey.split('/').reduce((r, e) => (r[e] ||= {}), obj)
  }

  function getPageMap<T extends Record<string, T>>(
    obj: T,
    list: (Folder | MdxFile)[],
    prefix = ''
  ) {
    for (const [name, value] of Object.entries(obj)) {
      const path = `${prefix}/${name}`
      const routeKey = path
        .replace(`/${basePath}/`, '')
        .replace(/(\/|^)index$/, '')
        .replace(/^\//, '')
      if (name === '_meta') {
        const __metaPath = metaFiles[routeKey]
        if (!__metaPath) {
          const o = JSON.stringify({ path, routeKey, metaFiles }, null, 2)
          throw new Error(`Can't find "_meta" file for ${path}\n${o}`)
        }
        // @ts-expect-error
        list.push({ __metaPath })
        continue
      }
      const item: Folder | MdxFile = {
        name: name || 'index',
        route: path.replace(/\/index$/, '') || '/'
      }
      const keys = Object.keys(value)

      const isFolder =
        keys.length > 1 || (keys.length === 1 && keys[0] !== 'index')
      if (isFolder) {
        ;(item as Folder).children = getPageMap(value, [], path)
      } else if (!name.startsWith('[')) {
        const pagePath = mdxPages[routeKey]
        if (!pagePath) {
          const o = JSON.stringify({ path, routeKey, mdxPages }, null, 2)
          throw new Error(`Can't find "page" file for ${path}\n${o}`)
        }
        // @ts-expect-error
        item.__pagePath = pagePath
      }
      list.push(item)
    }
    return list
  }

  const pageMap = getPageMap(obj, [])

  return { pageMap, mdxPages }
}
