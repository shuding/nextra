import type { z } from 'zod'
import { ERROR_ROUTES } from '../constants.js'
import type {
  displaySchema,
  menuItemSchema,
  pageThemeSchema
} from '../server/schemas'
import type { Folder, MdxFile, MetaJsonFile, PageMapItem } from '../types'

const DEFAULT_PAGE_THEME: PageTheme = {
  breadcrumb: true,
  collapsed: false,
  footer: true,
  layout: 'default',
  navbar: true,
  pagination: true,
  sidebar: true,
  timestamp: true,
  toc: true,
  typesetting: 'default'
}

export type PageTheme = z.infer<typeof pageThemeSchema>

type Display = z.infer<typeof displaySchema>
type IMenuItem = z.infer<typeof menuItemSchema>
type MetaType = Record<string, any>

function extendMeta(
  _meta: MetaType = {},
  fallback: MetaType,
  metadata: MetaType = {}
): MetaType {
  const theme: PageTheme = {
    ...fallback.theme,
    ..._meta.theme,
    ...metadata.theme
  }
  return {
    ...fallback,
    ..._meta,
    display: metadata.display || _meta.display || fallback.display,
    theme
  }
}

type FolderWithoutChildren = Omit<Folder, 'children'>

export type Item = (MdxFile | FolderWithoutChildren) & {
  title: string
  type: string
  children: Item[]
  display?: Display
  withIndexPage?: boolean
  theme?: PageTheme
  isUnderCurrentDocsTree?: boolean
}

export type PageItem = (MdxFile | FolderWithoutChildren) & {
  title: string
  type: string
  href?: string
  newWindow?: boolean
  children?: PageItem[]
  firstChildRoute?: string
  display?: Display
  withIndexPage?: boolean
  isUnderCurrentDocsTree?: boolean
}

export type MenuItem = (MdxFile | FolderWithoutChildren) &
  IMenuItem & {
    children?: PageItem[]
  }

type DocsItem = (MdxFile | FolderWithoutChildren) & {
  title: string
  type: string
  children: DocsItem[]
  firstChildRoute?: string
  withIndexPage?: boolean
  isUnderCurrentDocsTree?: boolean
}

function findFirstRoute(items: DocsItem[]): string | undefined {
  for (const item of items) {
    if (item.route) return item.route
    if (item.children) {
      const route = findFirstRoute(item.children)
      if (route) return route
    }
  }
}

type NormalizedResult = {
  activeType?: string
  activeIndex: number
  activeThemeContext: PageTheme
  activePath: Item[]
  directories: Item[]
  flatDirectories: Item[]
  docsDirectories: DocsItem[]
  flatDocsDirectories: DocsItem[]
  topLevelNavbarItems: (PageItem | MenuItem)[]
}

export function normalizePages({
  list,
  route,
  docsRoot = '',
  underCurrentDocsRoot = false,
  pageThemeContext = DEFAULT_PAGE_THEME
}: {
  list: PageMapItem[]
  route: string
  docsRoot?: string
  underCurrentDocsRoot?: boolean
  pageThemeContext?: PageTheme
}): NormalizedResult {
  let meta: MetaType = {}
  let metaKeys: (keyof MetaType)[] = []
  const items: any[] = []

  list.sort((a, b) => {
    if ('data' in a) return -1
    if ('data' in b) return 1
    return a.name.localeCompare(b.name)
  })

  for (const [index, item] of list.entries()) {
    if ('data' in item) {
      meta = item.data
      metaKeys = Object.keys(meta).filter(key => key !== '*')
      for (const key of metaKeys) {
        if (typeof meta[key] !== 'string') continue
        meta[key] = { title: meta[key] }
      }
      continue
    }
    const prevItem = list[index - 1] as Exclude<PageMapItem, MetaJsonFile>

    // If there are two items with the same name, they must be a directory and a
    // page. In that case we merge them, and use the page's link.
    if (prevItem && prevItem.name === item.name) {
      items[items.length - 1] = {
        ...prevItem,
        withIndexPage: true,
        // @ts-expect-error fixme
        frontMatter: item.frontMatter
      }
      continue
    }
    items.push(item)
  }
  // Normalize items based on files and _meta.json.
  items.sort((a, b) => {
    const indexA = metaKeys.indexOf(a.name)
    const indexB = metaKeys.indexOf(b.name)
    if (indexA === -1 && indexB === -1) return a.name < b.name ? -1 : 1
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  for (const [index, metaKey] of metaKeys.entries()) {
    const metaItem = meta[metaKey]
    const item = items.find(item => item.name === metaKey)
    if (metaItem.type === 'menu') {
      if (item) {
        item.items = metaItem.items
        if (typeof window === 'undefined') {
          // Validate only on server, will be tree-shaked in client build
          // Validate menu items, local page should exist
          const { children } = items.find(
            (i): i is Folder<MdxFile> => i.name === metaKey
          )!
          for (const [key, value] of Object.entries(
            item.items as Record<string, { title: string; href?: string }>
          )) {
            if (!value.href && children.every(i => i.name !== key)) {
              throw new Error(
                `Validation of "_meta" file has failed.
The field key "${metaKey}.items.${key}" in \`_meta\` file refers to a page that cannot be found, remove this key from "_meta" file.`
              )
            }
          }
        }
      }
    }
    if (item) continue

    if (typeof window === 'undefined') {
      // Validate only on server, will be tree-shaked in client build
      const isValid =
        metaItem.type === 'separator' ||
        metaItem.type === 'menu' ||
        metaItem.href

      if (!isValid) {
        throw new Error(
          `Validation of "_meta" file has failed.
The field key "${metaKey}" in \`_meta\` file refers to a page that cannot be found, remove this key from "_meta" file.`
        )
      }
    }

    const currentItem = items[index]
    if (currentItem && currentItem.name === metaKey) continue
    items.splice(
      index, // index at which to start changing the array
      0, // remove zero items
      { name: metaKey, ...meta[metaKey] }
    )
  }

  // All directories
  // - directories: all directories in the tree structure
  // - flatDirectories: all directories in the flat structure, used by search and footer navigation
  const directories: Item[] = []
  const flatDirectories: Item[] = []

  // Docs directories
  const docsDirectories: DocsItem[] = []
  const flatDocsDirectories: DocsItem[] = []

  // Page directories
  const topLevelNavbarItems: (PageItem | MenuItem)[] = []

  const { title: _title, href: _href, ...fallbackMeta } = meta['*'] || {}

  let activeType: string = fallbackMeta.type
  let activeIndex = 0
  let activeThemeContext = {
    ...pageThemeContext,
    ...fallbackMeta.theme
  }
  let activePath: Item[] = []

  for (const currentItem of items) {
    // Get the item's meta information.
    const extendedMeta = extendMeta(
      meta[currentItem.name],
      fallbackMeta,
      currentItem.frontMatter
    )
    const { display, type = 'doc' } = extendedMeta
    const extendedPageThemeContext = {
      ...pageThemeContext,
      ...extendedMeta.theme
    }

    // If the doc is under the active page root.
    const isCurrentDocsTree = route.startsWith(docsRoot)

    const normalizedChildren: undefined | NormalizedResult =
      currentItem.children &&
      normalizePages({
        list: currentItem.children,
        route,
        docsRoot:
          type === 'page' || type === 'menu' ? currentItem.route : docsRoot,
        underCurrentDocsRoot: underCurrentDocsRoot || isCurrentDocsTree,
        pageThemeContext: extendedPageThemeContext
      })

    const title =
      extendedMeta.title ||
      (type !== 'separator' &&
        (currentItem.frontMatter?.sidebarTitle ||
          currentItem.frontMatter?.title ||
          currentItem.name))

    const getItem = (): Item => ({
      ...currentItem,
      type,
      ...(title && { title }),
      ...(display && { display }),
      ...(normalizedChildren && { children: [] })
    })
    const item: Item = getItem()
    const docsItem: DocsItem = getItem()
    const pageItem: PageItem = getItem()

    docsItem.isUnderCurrentDocsTree = isCurrentDocsTree
    if (type === 'separator') {
      item.isUnderCurrentDocsTree = isCurrentDocsTree
    }

    // This item is currently active, we collect the active path etc.
    if (currentItem.route === route) {
      activePath = [item]
      activeType = type
      // There can be multiple matches.
      activeThemeContext = {
        ...activeThemeContext,
        ...extendedPageThemeContext
      }
      switch (type) {
        case 'page':
        case 'menu':
          // Active on the navbar
          activeIndex = topLevelNavbarItems.length
          break
        case 'doc':
          // Active in the docs tree
          activeIndex = flatDocsDirectories.length
      }
    }
    if (ERROR_ROUTES.has(currentItem.route)) {
      continue
    }

    const isHidden = display === 'hidden'

    // If this item has children
    if (normalizedChildren) {
      // If the active item is in its children
      if (
        normalizedChildren.activeIndex !== undefined &&
        normalizedChildren.activeType !== undefined
      ) {
        activeThemeContext = normalizedChildren.activeThemeContext
        activeType = normalizedChildren.activeType
        if (isHidden) {
          continue
        }
        activePath = [
          item,
          // Do not include folder which shows only his children
          ...normalizedChildren.activePath.filter(
            item => item.display !== 'children'
          )
        ]

        switch (activeType) {
          case 'page':
          case 'menu':
            activeIndex =
              topLevelNavbarItems.length + normalizedChildren.activeIndex
            break
          case 'doc':
            activeIndex =
              flatDocsDirectories.length + normalizedChildren.activeIndex
            break
        }
        if (currentItem.withIndexPage && type === 'doc') {
          activeIndex++
        }
      }

      switch (type) {
        case 'page':
        case 'menu':
          // @ts-expect-error normalizedChildren === true
          pageItem.children.push(...normalizedChildren.directories)
          docsDirectories.push(...normalizedChildren.docsDirectories)

          // If it's a page with children inside, we inject itself as a page too.
          if (normalizedChildren.flatDirectories.length) {
            const route = findFirstRoute(normalizedChildren.flatDirectories)
            if (route) pageItem.firstChildRoute = route
            topLevelNavbarItems.push(pageItem)
          } else if (pageItem.withIndexPage) {
            topLevelNavbarItems.push(pageItem)
          }

          break
        case 'doc':
          docsItem.children.push(...normalizedChildren.docsDirectories)
          // Itself is a doc page.
          if (item.withIndexPage && display !== 'children') {
            flatDocsDirectories.push(docsItem)
          }
      }

      flatDirectories.push(...normalizedChildren.flatDirectories)
      flatDocsDirectories.push(...normalizedChildren.flatDocsDirectories)
      item.children.push(...normalizedChildren.directories)
    } else {
      if (isHidden) {
        continue
      }
      flatDirectories.push(item)
      switch (type) {
        case 'page':
        case 'menu':
          topLevelNavbarItems.push(pageItem)
          break
        case 'doc': {
          const withHrefProp = 'href' in item
          // Do not include links with href in pagination
          if (!withHrefProp) {
            flatDocsDirectories.push(docsItem)
          }
        }
      }
    }

    if (isHidden) {
      continue
    }

    if (type === 'doc' && display === 'children') {
      // Hide the directory itself and treat all its children as pages
      if (docsItem.children) {
        directories.push(...docsItem.children)
        docsDirectories.push(...docsItem.children)
      }
    } else {
      directories.push(item)
    }

    switch (type) {
      case 'page':
      case 'menu':
        // @ts-expect-error -- fixme
        docsDirectories.push(pageItem)
        break
      case 'doc':
        if (display !== 'children') {
          docsDirectories.push(docsItem)
        }
        break
      case 'separator':
        docsDirectories.push(item)
    }
  }
  const result = {
    activeType,
    activeIndex,
    activeThemeContext,
    activePath,
    directories,
    flatDirectories,
    docsDirectories,
    flatDocsDirectories,
    topLevelNavbarItems
  }

  return result
}
