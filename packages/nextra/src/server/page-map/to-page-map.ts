import path from 'node:path'
import { normalizeAppPath } from 'next/dist/shared/lib/router/utils/app-paths.js'
import type { TItem } from '../../types.js'

interface NestedMap {
  [key: string]: NestedMap
}

type StringMap = Record<string, string>

function createNested(map: NestedMap, path: string): void {
  let current = map
  for (const part of path.split('/')) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive?
    current[part] ||= {} // Create the nested object if it doesn't exist
    current = current[part] // Move to the next level of the structure
  }
}

const APP_DIR_SUFFIX_RE = /^(src\/)?app\//

export function convertToPageMap({
  filePaths,
  basePath,
  locale
}: {
  filePaths: string[]
  basePath?: string
  locale?: string
}) {
  const pages: StringMap = {}
  const metaFiles: StringMap = {}
  const nestedMap: NestedMap = {}

  for (const filePath of filePaths) {
    let { name, dir } = path.parse(filePath)
    const inAppDir = APP_DIR_SUFFIX_RE.test(filePath)
    if (inAppDir) {
      dir = dir.replace(/^(src\/)?app(\/|$)/, '')
    } else {
      let filePath = dir.replace(/^(src\/)?content(\/|$)/, '')
      if (locale) filePath = filePath.replace(new RegExp(`^${locale}/?`), '')
      dir = [basePath, filePath].filter(Boolean).join('/')
    }
    if (name === '_meta') {
      const key = dir ? `${dir}/${name}` : name
      metaFiles[key] = filePath
    } else if (name !== '_meta.global') {
      const key = inAppDir
        ? // In Next.js we can organize routes without affecting the URL
          // https://nextjs.org/docs/app/building-your-application/routing/route-groups#organize-routes-without-affecting-the-url-path
          //
          // E.g. we have the following filepath:
          // app/posts/(with-comments)/aaron-swartz-a-programmable-web/()/page.mdx
          //
          // will be normalized to:
          // app/posts/aaron-swartz-a-programmable-web/page.mdx
          //
          // The `normalizeAppPath` function ensures a leading slash is present, so we slice it off.
          normalizeAppPath(dir).slice(1)
        : [dir, name !== 'index' && name].filter(Boolean).join('/')
      pages[key] = filePath
    }
  }

  for (const path of Object.keys(metaFiles)) {
    createNested(nestedMap, path)
  }
  for (const path of Object.keys(pages)) {
    createNested(nestedMap, path && `${path}/`)
  }

  function fillPageMap(obj: NestedMap, prefix?: string): TItem[] {
    return Object.entries(obj).map(([key, value]) => {
      const path = prefix && key ? `${prefix}/${key}` : prefix || key
      if (key === '_meta') {
        const __metaPath = metaFiles[path]
        if (!__metaPath) {
          const o = JSON.stringify({ path, metaFiles }, null, 2)
          throw new Error(`Can't find "_meta" file for:\n${o}`)
        }
        return { __metaPath }
      }
      const item = {
        name: key || 'index',
        route: `/${path}`
      }
      const keys = Object.keys(value)
      const isFolder = keys.length > 1 || (keys.length === 1 && keys[0] !== '')
      if (isFolder) {
        return { ...item, children: fillPageMap(value, path) }
      }
      const __pagePath = pages[path]
      if (!__pagePath) {
        const o = JSON.stringify({ path, mdxPages: pages }, null, 2)
        throw new Error(`Can't find "page" file for:\n${o}`)
      }
      return { ...item, __pagePath }
    })
  }

  const pageMap = fillPageMap(nestedMap)

  const mdxPages = Object.fromEntries(
    Object.entries(pages).flatMap(([key, value]) => {
      if (basePath) key = key.replace(new RegExp(`^${basePath}/?`), '')
      value = value.replace(/^(src\/)?content\//, '')
      if (locale) value = value.replace(new RegExp(`^${locale}/`), '')

      // Do not add pages from `app/` dir to `mdxPages`
      if (APP_DIR_SUFFIX_RE.test(value)) {
        return []
      }

      return [[key, value]]
    })
  )
  return { pageMap, mdxPages }
}
