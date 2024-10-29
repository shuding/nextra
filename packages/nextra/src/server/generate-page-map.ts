import path from 'path'
import fg from 'fast-glob'
import slash from 'slash'
import type { Folder, MdxFile } from '../types'

type Params = {
  dir: string
  cwd: string
  locale?: string
}

export async function getFilepaths({
  dir,
  cwd,
  locale
}: Params): Promise<string[]> {
  const appDir = slash(path.relative(cwd, dir))
  const contentDir = locale ? `content/${locale}` : 'content'
  const result = await fg(
    [
      `${appDir}/**/page.{js,jsx,jsx,tsx,md,mdx}`,
      `${appDir}/**/_meta.{js,jsx,ts,tsx}`,
      `${contentDir}/**/_meta.{js,jsx,ts,tsx}`,
      `${contentDir}/**/*.{md,mdx}`,
      // Ignore dynamic routes
      '!**/\\[*/*'
    ],
    { cwd }
  )
  const relativePaths = result
    // sort filepaths alphabetically
    .sort((a, b) => {
      if (a.startsWith('index.')) {
        return -1
      }
      return a.localeCompare(b)
    })
  return relativePaths
}

export function generatePageMapFromFilepaths(
  filepaths: string[],
  basePath = ''
): any {
  let mdxPages: Record<string, string> = Object.create(null)
  const metaFiles: Record<string, string> = Object.create(null)
  for (const r of filepaths) {
    let { name, dir } = path.parse(r)
    if (dir.startsWith('content')) {
      const filePath = dir.replace(/^content(\/|$)/, '')
      dir = [basePath, filePath].filter(Boolean).join('/')
    } else {
      dir = dir.replace(/^app(\/|$)/, '')
    }
    if (name === 'page') {
      mdxPages[dir.replace(/\(.*\)\//, '')] = r
    } else if (name === '_meta') {
      metaFiles[`${dir}/_meta`.replace(/^\//, '')] = r
    } else {
      const key = `${dir}/${name}`.replace(/\/index$/, '').replace(/^\//, '')
      mdxPages[key] = r
    }
  }

  const obj = Object.create(null)

  for (const path of Object.keys(metaFiles)) {
    path.split('/').reduce((r, e) => (r[e] ||= {}), obj)
  }
  for (const path of Object.keys(mdxPages)) {
    const resultKey = [path, 'index'].filter(Boolean).join('/')
    resultKey.split('/').reduce((r, e) => (r[e] ||= {}), obj)
  }

  function getPageMap<T extends Record<string, T>>(
    obj: T,
    list: (Folder | MdxFile)[],
    prefix = ''
  ) {
    for (const [name, value] of Object.entries(obj)) {
      const path = `${prefix}/${name}`
      const routeKey = path.replace(/(\/|^)index$/, '').replace(/^\//, '')
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

  if (basePath) {
    mdxPages = Object.fromEntries(
      Object.entries(mdxPages).map(([key, value]) => [
        key.replace(basePath, '').replace(/^\//, ''),
        value.replace('content/', '')
      ])
    )
  }

  return { pageMap, mdxPages }
}
