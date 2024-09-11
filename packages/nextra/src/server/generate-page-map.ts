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
  const relativePaths = result.map(r => slash(path.relative(dir, r)))
  return relativePaths
}

export function generatePageMapFromFilepaths(filepaths: string[]): any {
  const mdxPages: Record<string, string> = {}
  const metaFiles: Record<string, string> = {}

  for (const r of filepaths) {
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

  for (const path of [...Object.keys(metaFiles), ...Object.keys(mdxPages)]) {
    ;`${path}/index`
      .replace(/^\//, '')
      .split('/')
      .reduce((r, e) => {
        return (r[e] ||= {})
      }, obj)
  }

  function getPageMap<T extends Record<string, T>>(
    obj: T,
    list: (Folder | MdxFile)[],
    prefix = ''
  ) {
    for (const [name, value] of Object.entries(obj)) {
      const route = `${prefix}/${name}`

      if (name === '_meta') {
        // @ts-expect-error
        list.push({ __metaPath: metaFiles[route.slice(1)] })
        continue
      }

      const item: Folder | MdxFile = {
        name,
        route: route.replace(/\/index$/, '') || '/'
      }
      const keys = Object.keys(value)

      const isFolder =
        keys.length > 1 || (keys.length === 1 && keys[0] !== 'index')
      if (isFolder) {
        ;(item as Folder).children = getPageMap(value, [], route).sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      } else if (!name.startsWith('[')) {
        // @ts-expect-error
        item.__pagePath = mdxPages[item.route.slice(1)]
      }
      list.push(item)
    }
    return list
  }

  const pageMap = getPageMap(obj, [])

  return { pageMap, mdxPages }
}
