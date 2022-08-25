import { FileMap, MdxPath, MetaJsonPath, PageMapItem } from './types'
import path from 'path'
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

  const metaPath = path.dirname(filePath)
  const metaFilename = locale
    ? META_FILENAME.replace('.', `.${locale}.`)
    : META_FILENAME

  const pageMeta =
    fileMap[`${metaPath}/${metaFilename}` as MetaJsonPath]?.meta?.[
      pageItem.name
    ]

  return {
    pageMap: locale
      ? filterRouteLocale(pageMap, locale, defaultLocale)
      : pageMap,
    title: normalizeMeta(pageMeta)?.title || pageItem.name,
    route: pageItem.route
  }
}
