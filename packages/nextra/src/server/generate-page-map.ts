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
      // appDir is empty string on tests
      ...(appDir
        ? [
            `${appDir}/**/page.{js,jsx,jsx,tsx,md,mdx}`,
            `${appDir}/**/_meta.{js,jsx,ts,tsx}`,
            `${contentDir}/**/_meta.{js,jsx,ts,tsx}`,
            `${contentDir}/**/*.{md,mdx}`
          ]
        : ['**/_meta.{js,jsx,ts,tsx}', '**/*.{md,mdx}']),
      // Ignore dynamic routes
      '!**/\\[*/*'
    ],
    { cwd }
  )
  // Sort filepaths alphabetically because there is different order on each
  // fast-glob invocation
  const relativePaths = result.sort((a, b) => a.localeCompare(b))
  return relativePaths
}

const LEADING_SLASH_RE = /^\//

export function generatePageMapFromFilepaths({
  filePaths,
  basePath = '',
  locale
}: {
  filePaths: string[]
  basePath?: string
  locale?: string
}): any {
  let mdxPages: Record<string, string> = Object.create(null)
  const metaFiles: Record<string, string> = Object.create(null)
  for (const filePath of filePaths) {
    let { name, dir } = path.parse(filePath)
    if (dir.startsWith('content')) {
      let filePath = dir.replace(/^content(\/|$)/, '')
      if (locale) filePath = filePath.replace(new RegExp(`${locale}\\/?`), '')
      dir = [basePath, filePath].filter(Boolean).join('/')
    } else {
      dir = dir.replace(/^app(\/|$)/, '')
    }
    if (name === 'page') {
      // In Next.js we can organize routes without affecting the URL
      // https://nextjs.org/docs/app/building-your-application/routing/route-groups#organize-routes-without-affecting-the-url-path
      //
      // E.g. we have the following filepath:
      // app/posts/(with-comments)/aaron-swartz-a-programmable-web/()/page.mdx
      //
      // will be normalized to:
      // app/posts/aaron-swartz-a-programmable-web/page.mdx
      mdxPages[dir.replaceAll(/\(.*?\)\//g, '')] = filePath
    } else if (name === '_meta') {
      metaFiles[`${dir}/_meta`.replace(LEADING_SLASH_RE, '')] = filePath
    } else {
      const key = `${dir}/${name}`
        .replace(/\/index$/, '')
        .replace(LEADING_SLASH_RE, '')
      mdxPages[key] = filePath
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
      const routeKey = path
        .replace(/(\/|^)index$/, '')
        .replace(LEADING_SLASH_RE, '')
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

  mdxPages = Object.fromEntries(
    Object.entries(mdxPages).map(([key, value]) => {
      if (basePath) key = key.replace(basePath, '')
      value = value.replace('content/', '')
      if (locale) value = value.replace(`${locale}/`, '')
      return [key.replace(LEADING_SLASH_RE, ''), value]
    })
  )

  return { pageMap, mdxPages }
}
