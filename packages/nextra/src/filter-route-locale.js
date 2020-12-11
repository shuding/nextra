export default function filterRouteLocale(pageMap, locale, defaultLocale) {
  const isDefaultLocale = !locale || locale === defaultLocale

  const filteredPageMap = []

  // We fallback to the default locale
  const fallbackPages = {}

  for (const page of pageMap) {
    if (page.children) {
      filteredPageMap.push({
        ...page,
        children: filterRouteLocale(page.children, locale, defaultLocale)
      })
      continue
    }

    const localDoesMatch =
      (!page.locale && isDefaultLocale) || page.locale === locale

    if (localDoesMatch) {
      fallbackPages[page.name] = null
      filteredPageMap.push(page)
    } else {
      if (
        fallbackPages[page.name] !== null &&
        (!page.locale || page.locale === defaultLocale)
      ) {
        fallbackPages[page.name] = page
      }
    }
  }

  for (const name in fallbackPages) {
    if (fallbackPages[name]) {
      filteredPageMap.push(fallbackPages[name])
    }
  }

  return filteredPageMap
}
