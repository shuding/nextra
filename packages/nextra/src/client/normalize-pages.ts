'use no memo'

import type { ReactNode } from 'react'
import type { z } from 'zod'
import type { itemSchema, menuSchema } from '../server/schemas.js'
import type { Folder, FrontMatter, MdxFile, PageMapItem } from '../types.js'

const DEFAULT_PAGE_THEME: PageTheme = {
  breadcrumb: true,
  collapsed: undefined,
  footer: true,
  layout: 'default',
  navbar: true,
  pagination: true,
  sidebar: true,
  timestamp: true,
  toc: true,
  typesetting: 'default'
}

type PageTheme = NonNullable<z.infer<typeof itemSchema>['theme']>
type Display = z.infer<typeof itemSchema>['display']
type IMenuItem = z.infer<typeof menuSchema>
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
  title: ReactNode
  type: string
  children: Item[]
  display?: Display
  theme?: PageTheme
  frontMatter: FrontMatter
  isUnderCurrentDocsTree?: boolean
}

export type PageItem = (MdxFile | FolderWithoutChildren) & {
  title: ReactNode
  type: string
  href?: string
  children?: PageItem[]
  firstChildRoute?: string
  display?: Display
  isUnderCurrentDocsTree?: boolean
}

export type MenuItem = (MdxFile | FolderWithoutChildren) &
  IMenuItem & {
    children?: PageItem[]
  }

type DocsItem = (MdxFile | FolderWithoutChildren) & {
  title: ReactNode
  type: string
  children: DocsItem[]
  firstChildRoute?: string
  isUnderCurrentDocsTree?: boolean
}

function findFirstRoute(items: DocsItem[]): string | undefined {
  for (const item of items) {
    if (item.route) return item.route
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- fixme
    if (item.children) {
      const route = findFirstRoute(item.children)
      if (route) return route
    }
  }
}

type NormalizedResult = {
  /** Active type for current page, used to determine layout in theme. */
  activeType?: 'doc' | 'page' | 'menu'
  /**
   * Active index for current page, used for pagination in combination with `flatDocsDirectories`
   * items.
   */
  activeIndex: number
  activeThemeContext: PageTheme
  /**
   * Parsed [front matter](https://jekyllrb.com/docs/front-matter) or exported
   * [Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) from page.
   */
  activeMetadata?: FrontMatter
  /** Active path for current page, used for breadcrumb navigation. */
  activePath: Item[]
  /** All directories in the tree structure. */
  directories: Item[]
  /** Directories with `type: 'doc'` in `_meta` file. */
  docsDirectories: DocsItem[]
  /** Flattened directories with `type: 'doc'` in `_meta` file. */
  flatDocsDirectories: DocsItem[]
  /** Navbar items, items which have `type: 'page'` in `_meta` file. */
  topLevelNavbarItems: (PageItem | MenuItem)[]
}

export function normalizePages({
  list,
  route,
  /** @default '' */
  docsRoot = '',
  /** @default DEFAULT_PAGE_THEME */
  pageThemeContext = DEFAULT_PAGE_THEME
}: {
  list: PageMapItem[]
  route: string
  docsRoot?: string
  underCurrentDocsRoot?: boolean
  pageThemeContext?: PageTheme
}): NormalizedResult {
  // If the doc is under the active page root.
  const underCurrentDocsRoot = route.startsWith(docsRoot)
  const directories: Item[] = []
  const docsDirectories: DocsItem[] = []
  const flatDocsDirectories: DocsItem[] = []
  const topLevelNavbarItems: (PageItem | MenuItem)[] = []
  const firstItem = list[0]! // always exists
  const meta = 'data' in firstItem ? (firstItem.data as MetaType) : {}
  // Normalize items based on files and _meta.json.
  const items = ('data' in firstItem ? list.slice(1) : list) as (
    | (Folder & { frontMatter?: FrontMatter })
    | MdxFile
  )[]

  const fallbackMeta = meta['*'] || {}

  let activeType: NormalizedResult['activeType'] = fallbackMeta.type
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

    const normalizedChildren: false | NormalizedResult =
      'children' in currentItem &&
      normalizePages({
        list: currentItem.children,
        route,
        docsRoot:
          type === 'page' || type === 'menu' ? currentItem.route : docsRoot,
        underCurrentDocsRoot,
        pageThemeContext: extendedPageThemeContext
      })

    const getItem = (): Item => ({
      ...currentItem,
      type,
      ...('title' in currentItem && { title: currentItem.title }),
      ...(display && { display }),
      ...(normalizedChildren && { children: [] })
    })
    const item: Item = getItem()
    const docsItem: DocsItem = getItem()
    if ('children' in docsItem) {
      const { collapsed } = extendedMeta.theme
      if (typeof collapsed === 'boolean') {
        // @ts-expect-error -- fixme
        docsItem.theme = { collapsed }
      }
    }
    const pageItem: PageItem = getItem()

    docsItem.isUnderCurrentDocsTree = underCurrentDocsRoot
    if (type === 'separator') {
      item.isUnderCurrentDocsTree = underCurrentDocsRoot
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
    const isHidden = display === 'hidden'

    // If this item has children
    if (normalizedChildren) {
      // If the active item is in its children
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- fixme
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
        if ('frontMatter' in currentItem && type === 'doc') {
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
          if (normalizedChildren.flatDocsDirectories.length) {
            const route = findFirstRoute(normalizedChildren.flatDocsDirectories)
            if (route) pageItem.firstChildRoute = route
            topLevelNavbarItems.push(pageItem)
          } else if ('frontMatter' in pageItem) {
            topLevelNavbarItems.push(pageItem)
          }

          break
        case 'doc':
          docsItem.children.push(...normalizedChildren.docsDirectories)
          // Itself is a doc page.
          if ('frontMatter' in item && display !== 'children') {
            flatDocsDirectories.push(docsItem)
          }
      }

      flatDocsDirectories.push(...normalizedChildren.flatDocsDirectories)
      item.children.push(...normalizedChildren.directories)
    } else {
      if (isHidden) {
        continue
      }
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- fixme
      if (docsItem.children) {
        // @ts-expect-error -- fixme
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
  const activeMetadata = activePath.at(-1)?.frontMatter

  const result = {
    activeType,
    activeIndex,
    activeThemeContext,
    activeMetadata,
    activePath,
    directories,
    docsDirectories: docsDirectories.filter(
      item => item.isUnderCurrentDocsTree
    ),
    flatDocsDirectories,
    topLevelNavbarItems
  }

  return result
}
