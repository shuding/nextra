import type { MdxFile, MetaJsonFile, PageMapItem } from './types'
import { truthy } from './utils'

export default function filterRouteLocale(
  pageMap: PageMapItem[],
  locale: string,
  defaultLocale: string
): PageMapItem[] {
  const isDefaultLocale = !locale || locale === defaultLocale

  const filteredPageMap: PageMapItem[] = []

  // We fallback to the default locale
  const fallbackPages: Record<string, PageMapItem | null> = Object.create(null)

  for (let page of pageMap) {
    if ('children' in page && page.children) {
      filteredPageMap.push({
        ...page,
        children: filterRouteLocale(page.children, locale, defaultLocale)
      })
      continue
    }
    page = page as MdxFile | MetaJsonFile
    const localDoesMatch =
      (!page.locale && isDefaultLocale) || page.locale === locale

    if (localDoesMatch) {
      fallbackPages[page.name] = null
      filteredPageMap.push(page)
    } else if (
      fallbackPages[page.name] !== null &&
      (!page.locale || page.locale === defaultLocale)
    ) {
      fallbackPages[page.name] = page
    }
  }

  return [
    ...filteredPageMap,
    ...Object.values(fallbackPages).filter(truthy)
  ]
}
