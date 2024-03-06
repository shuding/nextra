import type { z } from 'zod'
import { ERROR_ROUTES } from '../constants.js'
import type {
  displaySchema,
  menuItemSchema,
  pageThemeSchema
} from '../server/schemas'
import type { Folder, MdxFile, PageMapItem } from '../types'
import { isMeta } from './utils.js'

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

function extendMeta(
  _meta: string | Record<string, any> = {},
  fallback: Record<string, any>,
  metadata: Record<string, any>
): Record<string, any> {
  if (typeof _meta === 'string') {
    _meta = { title: _meta }
  }
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
  children?: Item[]
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
  children?: DocsItem[]
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
  let _meta: Record<string, any> | undefined
  for (const item of list) {
    if (isMeta(item)) {
      _meta = item.data
      break
    }
  }
  const meta = _meta || {}
  const metaKeys = Object.keys(meta)

  for (const key of metaKeys) {
    if (typeof meta[key] === 'string') {
      meta[key] = {
        title: meta[key]
      }
    }
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

  let activeType: string | undefined
  let activeIndex = 0
  let activeThemeContext = pageThemeContext
  let activePath: Item[] = []

  let metaKeyIndex = -1

  const fallbackMeta = meta['*'] || {}
  delete fallbackMeta.title
  delete fallbackMeta.href

  // Normalize items based on files and _meta.json.
  const items = list
    .filter(
      (a): a is MdxFile | Folder =>
        !isMeta(a) &&
        // not hidden routes
        !a.name.startsWith('_')
    )
    .sort((a, b) => {
      const indexA = metaKeys.indexOf(a.name)
      const indexB = metaKeys.indexOf(b.name)
      if (indexA === -1 && indexB === -1) return a.name < b.name ? -1 : 1
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
    .flatMap(item => {
      const items = []
      const index = metaKeys.indexOf(item.name)
      let extendedItem
      if (index !== -1) {
        // Fill all skipped items in meta.
        for (let i = metaKeyIndex + 1; i < index; i++) {
          const key = metaKeys[i]
          if (key !== '*') {
            items.push({
              name: key,
              route: '',
              ...meta[key]
            })
          }
        }
        metaKeyIndex = index
        extendedItem = { ...meta[item.name], ...item }
      }
      items.push(extendedItem || item)
      return items
    })

  // Fill all skipped items in meta.
  for (let i = metaKeyIndex + 1; i < metaKeys.length; i++) {
    const key = metaKeys[i]
    if (key !== '*') {
      items.push({
        name: key,
        ...meta[key]
      })
    }
  }

  for (let i = 0; i < items.length; i++) {
    const currentItem = items[i]
    const nextItem = items[i + 1]

    // If there are two items with the same name, they must be a directory and a
    // page. In that case we merge them, and use the page's link.
    if (nextItem && nextItem.name == currentItem.name) {
      items[i + 1] = {
        ...nextItem,
        withIndexPage: true,
        children: nextItem.children || currentItem.children
      }
      continue
    }

    // Get the item's meta information.
    const extendedMeta = extendMeta(
      meta[currentItem.name],
      fallbackMeta,
      list.find(
        (item): item is MdxFile =>
          'frontMatter' in item && item.name === currentItem.name
      )?.frontMatter || {}
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
    if (display === 'hidden' || ERROR_ROUTES.has(currentItem.route)) {
      continue
    }

    // If this item has children
    if (normalizedChildren) {
      // If the active item is in its children
      if (
        normalizedChildren.activeIndex !== undefined &&
        normalizedChildren.activeType !== undefined
      ) {
        activeThemeContext = normalizedChildren.activeThemeContext
        activeType = normalizedChildren.activeType
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
            pageItem.firstChildRoute = findFirstRoute(
              normalizedChildren.flatDirectories
            )
            topLevelNavbarItems.push(pageItem)
          } else if (pageItem.withIndexPage) {
            topLevelNavbarItems.push(pageItem)
          }

          break
        case 'doc':
          if (Array.isArray(docsItem.children)) {
            docsItem.children.push(...normalizedChildren.docsDirectories)
          }
          // Itself is a doc page.
          if (item.withIndexPage && display !== 'children') {
            flatDocsDirectories.push(docsItem)
          }
      }

      flatDirectories.push(...normalizedChildren.flatDirectories)
      flatDocsDirectories.push(...normalizedChildren.flatDocsDirectories)
      if (Array.isArray(item.children)) {
        item.children.push(...normalizedChildren.directories)
      }
    } else {
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

  return {
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
}
