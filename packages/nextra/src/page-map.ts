import { PageMapItem } from './types'
import { parseFileName } from './utils'
import path from 'path'
import filterRouteLocale from './filter-route-locale'
import { META_FILENAME } from './constants'

export function getPageMap(
  currentResourcePath: string,
  pageMap: PageMapItem[],
  fileMap: Record<string, PageMapItem>,
  defaultLocale: string
): [PageMapItem[], string, string] {
  const { locale } = parseFileName(currentResourcePath)
  const pageItem = fileMap[currentResourcePath]
  const [metaName, metaExt] = META_FILENAME.split('.')
  const metaPath = path.dirname(currentResourcePath)
  const metaFilename = `${metaName}.${locale && `${locale}.`}${metaExt}`
  const pageMeta = fileMap[`${metaPath}/${metaFilename}`]?.meta?.[pageItem.name]
  const title =
    (typeof pageMeta === 'string' ? pageMeta : pageMeta?.title) || pageItem.name

  return [
    locale ? filterRouteLocale(pageMap, locale, defaultLocale) : pageMap,
    pageItem.route,
    title
  ]
}
