function importPageMap(lang = '') {
  return import(`./page-map-placeholder.js?lang=${lang}`)
}

export async function getPageMap(lang?: string) {
  const { pageMap } = await importPageMap(lang)
  return pageMap
}

export async function getRouteToFilepath(
  lang?: string
): Promise<Record<string, string>> {
  const { RouteToFilepath } = await importPageMap(lang)
  return RouteToFilepath
}
