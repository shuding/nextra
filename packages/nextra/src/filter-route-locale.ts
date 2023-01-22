import type { PageMapItem } from './types'
import { truthy } from './utils'
import { META_FILENAME } from './constants'

export default function filterRouteLocale(
  pageMap: PageMapItem[],
  locale: string,
  defaultLocale: string
): PageMapItem[] {
  const isDefaultLocale = !locale || locale === defaultLocale

  const filteredPageMap: PageMapItem[] = []

  // We fallback to the default locale
  const fallbackPages: Record<string, PageMapItem | null> = Object.create(null)

  for (const page of pageMap) {
    if (page.kind === 'Folder') {
      filteredPageMap.push({
        ...page,
        children: filterRouteLocale(page.children, locale, defaultLocale)
      })
      continue
    }
    const localDoesMatch =
      (!page.locale && isDefaultLocale) || page.locale === locale
    const name = page.kind === 'Meta' ? META_FILENAME : page.name
    if (localDoesMatch) {
      fallbackPages[name] = null
      filteredPageMap.push(page)
    } else if (
      fallbackPages[name] !== null &&
      (!page.locale || page.locale === defaultLocale)
    ) {
      fallbackPages[name] = page
    }
  }

  return [...filteredPageMap, ...Object.values(fallbackPages).filter(truthy)]
}
