import path from 'path'
import fg from 'fast-glob'

type Params = {
  appDir: string
  cwd: string
}

export async function getFilepaths({ appDir, cwd }: Params): Promise<string[]> {
  if (!appDir) {
    throw new Error('Unable to find `app` directory')
  }
  const result = await fg(
    path.join(appDir, '**/page.{js,jsx,jsx,tsx,md,mdx}'),
    { cwd }
  )
  const relativePaths = result.map(r => path.relative(appDir, r))
  return relativePaths
}

export function generatePageMapFromFilepaths(filepaths: string[]): any {
  const paths = filepaths.map(r => {
    const pathInfo = path.parse(r)

    if (pathInfo.name === 'page') {
      return `${pathInfo.dir.replace(/\(.*\)\//, '')}/index`.replace(/^\//, '')
    }
    throw new Error('unchecked')
  })

  const obj = Object.create(null)

  for (const path of paths) {
    path.split('/').reduce((r, e) => {
      return (r[e] ||= {})
    }, obj)
  }

  function getPageMap(obj, list: any[], prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const route = `${prefix}/${key}`
      const isFolder = Object.keys(value).length > 1
      list.push({
        name: key,
        route: route.replace(/\/index$/, '') || '/',
        ...(isFolder && {
          children: getPageMap(value, [], route).sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        })
      })
    }
    return list
  }

  return getPageMap(obj, [])
}
