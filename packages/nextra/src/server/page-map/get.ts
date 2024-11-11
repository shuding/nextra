import type { Folder, PageMapItem } from '../../types.js'

function importPageMap(lang = ''): Promise<{
  pageMap: PageMapItem[]
  RouteToFilepath: Record<string, string>
}> {
  return import(`./placeholder.js?lang=${lang}`)
}

export async function getPageMap(lang?: string, route = '/') {
  let { pageMap } = await importPageMap(lang)

  const segments = route.split('/').filter(Boolean)
  let segment: string | undefined
  while ((segment = segments.shift())) {
    const folder = pageMap.find(
      (item): item is Folder => 'name' in item && item.name === segment
    )
    if (!folder) {
      throw new Error(`Can't find pageMap for "${segment}" in route "${route}"`)
    }
    pageMap = folder.children
  }

  return pageMap
}

export async function getRouteToFilepath(
  lang?: string
): Promise<Record<string, string>> {
  const { RouteToFilepath } = await importPageMap(lang)
  return RouteToFilepath
}
