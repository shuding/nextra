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

interface NestedMap {
  [key: string]: NestedMap
}

const createNested = (prevValue: NestedMap, currVal: string) =>
  (prevValue[currVal] ||= {})

export function generatePageMapFromFilepaths({
  filePaths,
  basePath,
  locale
}: {
  filePaths: string[]
  basePath?: string
  locale?: string
}): { mdxPages: Record<string, string>; pageMap: any[] } {
  let mdxPages: Record<string, string> = Object.create(null)
  const metaFiles: Record<string, string> = Object.create(null)
  for (const filePath of filePaths) {
    let { name, dir } = path.parse(filePath)
    if (dir.startsWith('content')) {
      let filePath = dir.replace(/^content(\/|$)/, '')
      if (locale) filePath = filePath.replace(new RegExp(`^${locale}/?`), '')
      dir = [basePath, filePath].filter(Boolean).join('/')
    } else {
      dir = dir.replace(/^app(\/|$)/, '')
    }
    if (name === '_meta') {
      const key = dir ? `${dir}/${name}` : name
      metaFiles[key] = filePath
    } else {
      const key =
        name === 'page'
          ? // In Next.js we can organize routes without affecting the URL
            // https://nextjs.org/docs/app/building-your-application/routing/route-groups#organize-routes-without-affecting-the-url-path
            //
            // E.g. we have the following filepath:
            // app/posts/(with-comments)/aaron-swartz-a-programmable-web/()/page.mdx
            //
            // will be normalized to:
            // app/posts/aaron-swartz-a-programmable-web/page.mdx
            dir.replaceAll(/\(.*?\)\//g, '')
          : [dir, name.replace(/^index$/, '')].filter(Boolean).join('/')
      mdxPages[key] = filePath
    }
  }

  const obj: NestedMap = {}

  for (const path of Object.keys(metaFiles)) {
    path.split('/').reduce(createNested, obj)
  }
  for (const path of Object.keys(mdxPages)) {
    const key = path ? `${path}/` : ''
    key.split('/').reduce(createNested, obj)
  }

  function getPageMap<T extends Record<string, T>>(obj: T, prefix = '') {
    const children: (Folder | MdxFile | { __metaPath: string })[] = []

    for (const [name, value] of Object.entries(obj)) {
      const path = prefix && name ? `${prefix}/${name}` : prefix || name
      if (name === '_meta') {
        const __metaPath = metaFiles[path]
        if (!__metaPath) {
          const o = JSON.stringify({ path, metaFiles }, null, 2)
          throw new Error(`Can't find "_meta" file for ${path}\n${o}`)
        }
        children.push({ __metaPath })
        continue
      }
      const item: Folder | MdxFile = {
        name: name || 'index',
        route: `/${path}`
      }
      const keys = Object.keys(value)

      const isFolder = keys.length > 1 || (keys.length === 1 && keys[0] !== '')
      if (isFolder) {
        ;(item as any).children = getPageMap(value, path)
      } else {
        const pagePath = mdxPages[path]
        if (!pagePath) {
          const o = JSON.stringify({ path, mdxPages }, null, 2)
          throw new Error(`Can't find "page" file for ${path}\n${o}`)
        }
        // @ts-expect-error
        item.__pagePath = pagePath
      }
      children.push(item)
    }
    return children
  }

  const pageMap = getPageMap(obj)

  mdxPages = Object.fromEntries(
    Object.entries(mdxPages).flatMap(([key, value]) => {
      if (basePath) key = key.replace(new RegExp(`^${basePath}/?`), '')
      value = value.replace(/^content\//, '')
      if (locale) value = value.replace(new RegExp(`^${locale}/`), '')

      // Do not add pages from `app/` dir to `mdxPages`
      if (value.startsWith('app/')) {
        return []
      }

      return [[key, value]]
    })
  )
  return { pageMap, mdxPages }
}
