import type { Folder, PageMapItem } from '../../types.js'

function importPageMap(lang = ''): Promise<{
  pageMap: PageMapItem[]
  RouteToFilepath: Record<string, string>
}> {
  return import(`./placeholder.js?lang=${lang}`)
}

const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE

/**
 * Retrieves the page map structure for a given route handling nested routes.
 *
 * The page map structure represents the hierarchical organization of your documentation or content,
 * where each item can be either a page or a folder containing more pages.
 *
 * @returns A Promise that resolves to an array of `PageMapItem` objects representing the page structure
 * such as `MdxFile`, `Folder` and `MetaJsonFile`.
 *
 * @example
 * ```ts
 * import { getPageMap } from 'nextra/page-map'
 *
 * // Get the root page map
 * const rootPageMap = await getPageMap()
 *
 * // Get the page map for a specific route
 * const blogPageMap = await getPageMap('/blog')
 *
 * // Get the page map for a specific language when using i18n
 * const enPageMap = await getPageMap('/en')
 * ```
 *
 * @throws {Error} when the specified route segment cannot be found in the page map.
 *
 * @see [Page Map Structure Documentation](https://nextra.site/docs/file-conventions/meta-file#pagemap-structure).
 */
export async function getPageMap(
  /**
   * The route path to retrieve the page map for.
   * @default "/"
   */
  route = '/'
) {
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
