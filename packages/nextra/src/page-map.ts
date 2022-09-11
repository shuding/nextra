import path from 'node:path'
import { FileMap, MdxPath, MetaJsonPath, PageMapItem } from './types'
import { META_FILENAME } from './constants'
import { normalizeMeta, parseFileName } from './utils'
import filterRouteLocale from './filter-route-locale'

type PageMapProps = {
  filePath: string
  pageMap: PageMapItem[]
  fileMap: FileMap
  defaultLocale: string
}

export function getPageMap({
  filePath,
  pageMap,
  fileMap,
  defaultLocale
}: PageMapProps): {
  title: string
  route: string
  pageMap: PageMapItem[]
} {
  const { locale } = parseFileName(filePath)
  const pageItem = fileMap[filePath as MdxPath]

  const metaFilename = locale
    ? META_FILENAME.replace('.', `.${locale}.`)
    : META_FILENAME
  const metaDir = path.dirname(filePath)
  const metaPath = path.join(metaDir, metaFilename) as MetaJsonPath

  const pageMeta = fileMap[metaPath].data[pageItem.name]

  return {
    pageMap: locale
      ? filterRouteLocale(pageMap, locale, defaultLocale)
      : pageMap,
    title: normalizeMeta(pageMeta).title,
    route: pageItem.route
  }
}
