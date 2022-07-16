import { PageMapItem } from './types'
import { parseFileName, existsSync } from './utils'
import path from 'path'
import filterRouteLocale from './filter-route-locale'

export function findPagesDir(dir = process.cwd()): string {
  // prioritize ./pages over ./src/pages
  if (existsSync(path.join(dir, 'pages'))) return 'pages'
  if (existsSync(path.join(dir, 'src/pages'))) return 'src/pages'

  throw new Error(
    "> Couldn't find a `pages` directory. Please create one under the project root"
  )
}

export function getPageMap(
  currentResourcePath: string,
  pageMap: PageMapItem[],
  fileMap: Record<string, PageMapItem>,
  defaultLocale: string
): [PageMapItem[], string, string] {
  const activeRouteLocale = parseFileName(currentResourcePath).locale
  const pageItem = fileMap[currentResourcePath]
  const metaPath = path.dirname(currentResourcePath)
  const metaExtension = activeRouteLocale ? `${activeRouteLocale}.json` : `json`
  const pageMeta =
    fileMap[`${metaPath}/meta.${metaExtension}`]?.meta?.[pageItem.name]
  const title =
    (typeof pageMeta === 'string' ? pageMeta : pageMeta?.title) || pageItem.name

  return [
    activeRouteLocale
      ? filterRouteLocale(pageMap, activeRouteLocale, defaultLocale)
      : pageMap,
    pageItem.route,
    title
  ]
}
