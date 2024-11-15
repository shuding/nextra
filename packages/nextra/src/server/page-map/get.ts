import type { Folder, PageMapItem } from '../../types.js'

function importPageMap(lang = ''): Promise<{
  pageMap: PageMapItem[]
  RouteToFilepath: Record<string, string>
}> {
  return import(`./placeholder.js?lang=${lang}`)
}

const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE

export async function getPageMap(route = '/') {
  const segments = route.split('/')
  // Remove 1 or 2 items from the beginning of the array
  const lang = segments.splice(0, defaultLocale ? 2 : 1).at(-1)!
  let { pageMap } = await importPageMap(lang)

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
