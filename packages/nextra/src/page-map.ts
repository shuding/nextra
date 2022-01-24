import { PageMapItem } from './types'
import { getLocaleFromFilename, existsSync } from './utils'
import path from 'path'
import filterRouteLocale from './filter-route-locale'
export const extension = /\.mdx?$/
export const metaExtension = /meta\.?([a-zA-Z-]+)?\.json/

export function findPagesDir(dir: string = process.cwd()): string {
  // prioritize ./pages over ./src/pages
  if (existsSync(path.join(dir, 'pages'))) return 'pages'
  if (existsSync(path.join(dir, 'src/pages'))) return 'src/pages'

  throw new Error(
    "> Couldn't find a `pages` directory. Please create one under the project root"
  )
}

export function getPageMap(
  currentResourcePath: string,
  pageMaps: PageMapItem[],
  fileMap: Record<string, PageMapItem>,
  defaultLocale: string
) {
  const activeRouteLocale = getLocaleFromFilename(currentResourcePath)
  const pageItem = fileMap[currentResourcePath]
  const metaPath = path.dirname(currentResourcePath)
  const metaExtension = activeRouteLocale ? `${activeRouteLocale}.json` : `json`
  const pageMeta =
    fileMap[`${metaPath}/meta.${metaExtension}`]?.meta?.[pageItem.name]
  const title =
    (typeof pageMeta === 'string' ? pageMeta : pageMeta?.title) || pageItem.name
  if (activeRouteLocale) {
    return [
      filterRouteLocale(pageMaps, activeRouteLocale, defaultLocale),
      fileMap[currentResourcePath].route,
      title
    ]
  }
  return [pageMaps, fileMap[currentResourcePath].route, title]
}
