import path from 'path'
import fg from 'fast-glob'
import type { Folder, MdxFile } from '../types'

type Params = {
  dir: string
  cwd?: string
  isAppDir?: boolean
}

export async function getFilepaths({
  dir,
  cwd,
  isAppDir
}: Params): Promise<string[]> {
  if (!dir) {
    throw new Error('`dir` is required')
  }
  const result = await fg(
    [
      path.join(
        dir,
        isAppDir ? '**/page.{js,jsx,jsx,tsx,md,mdx}' : '**/*.{md,mdx}'
      ),
      path.join(dir, '**/_meta.{js,jsx,ts,tsx}')
    ],
    { cwd }
  )
  const relativePaths = result.map(r => path.relative(dir, r))
  return relativePaths
}

export function generatePageMapFromFilepaths(filepaths: string[]): any {
  const paths = new Map(
    filepaths.map(r => {
      const pathInfo = path.parse(r)

      if (pathInfo.name === 'page') {
        return [pathInfo.dir.replace(/\(.*\)\//, ''), r]
      }
      if (pathInfo.name === '_meta') {
        return [`${pathInfo.dir}/_meta`.replace(/^\//, ''), r]
      }
      throw new Error('unchecked')
    })
  )

  const obj = Object.create(null)

  for (const path of paths.keys()) {
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
        list.push({ __metaPath: paths.get(route.slice(1)) })
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
        item.__pagePath = paths.get(item.route.slice(1))
      }
      list.push(item)
    }
    return list
  }

  const pageMap = getPageMap(obj, [])

  return pageMap
}
