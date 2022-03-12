import React from 'react'
import { PageMapItem } from 'nextra'
import getTitle from 'title'

import defaultThemeContext from '../misc/theme-context'

function getMetaTitle(meta: string | Record<string, any>) {
  if (typeof meta === 'string') return meta
  if (typeof meta === 'object') return meta.title
  return ''
}

function getMetaItemType(meta: string | Record<string, any>) {
  if (typeof meta === 'object') return meta.type
  return 'doc'
}

function getMetaHidden(meta: string | Record<string, any>) {
  if (typeof meta === 'object') return meta.hidden || false
  return false
}

export interface Item extends Omit<PageMapItem, 'children'> {
  title: string
  type: string
  children?: Item[]
  hidden?: boolean
  withIndexPage?: boolean
}
export interface PageItem extends Omit<PageMapItem, 'children'> {
  title: string
  type: string
  href?: string
  newWindow?: boolean
  children?: PageItem[]
  firstChildRoute?: string
  hidden?: boolean
  withIndexPage?: boolean
}
export interface DocsItem extends Omit<PageMapItem, 'children'> {
  title: string
  type: string
  children?: DocsItem[]
  firstChildRoute?: string
  withIndexPage?: boolean
}

export default function normalizePages({
  list,
  locale,
  defaultLocale,
  route,
  docsRoot = '',
  underCurrentDocsRoot = false,
  pageThemeContext = defaultThemeContext
}: {
  list: PageMapItem[]
  locale?: string
  defaultLocale?: string
  route: string
  docsRoot?: string
  underCurrentDocsRoot?: boolean
  pageThemeContext?: Record<keyof typeof defaultThemeContext, boolean>
}) {
  let _meta: Record<string, any> | undefined
  for (let item of list) {
    if (item.name === 'meta.json') {
      if (locale === item.locale) {
        _meta = item.meta
        break
      }
      // fallback
      if (!_meta) {
        _meta = item.meta
      }
    }
  }
  const meta = _meta || {}

  const metaKeys = Object.keys(meta)

  // All directories
  const directories: Item[] = []
  const flatDirectories: Item[] = []

  // Docs directories
  const docsDirectories: DocsItem[] = []
  const flatDocsDirectories: DocsItem[] = []

  // Page directories
  const pageDirectories: PageItem[] = []
  const topLevelPageItems: PageItem[] = []

  let activeType: string | undefined = undefined
  let activeIndex: number = 0
  let activeThemeContext = pageThemeContext
  let activePath: Item[] = []

  let metaKeyIndex = 0

  const items = list
    .filter(
      a =>
        // not meta
        a.name !== 'meta.json' &&
        // not hidden routes
        !a.name.startsWith('_') &&
        // locale matches, or fallback to default locale
        (a.locale === locale || a.locale === defaultLocale || !a.locale)
    )
    .sort((a, b) => {
      const indexA = metaKeys.indexOf(a.name)
      const indexB = metaKeys.indexOf(b.name)
      if (indexA === -1 && indexB === -1) return a.name < b.name ? -1 : 1
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
    .flatMap(a => {
      const items = []
      const index = metaKeys.indexOf(a.name)

      if (index !== -1) {
        // Fill all skipped items in meta.
        for (let i = metaKeyIndex + 1; i < index; i++) {
          const key = metaKeys[i]
          items.push({
            name: key,
            route: '#',
            ...meta[key]
          })
        }
        metaKeyIndex = index
      }

      items.push(a)
      return items
    })

  // Fill all skipped items in meta.
  for (let i = metaKeyIndex + 1; i < metaKeys.length; i++) {
    const key = metaKeys[i]
    items.push({
      name: key,
      route: '#',
      ...meta[key]
    })
  }

  for (let i = 0; i < items.length; i++) {
    const a = items[i]

    // If there are two items with the same name, they must be a directory and a
    // page. In that case we merge them, and use the page's link.
    if (i + 1 < items.length && a.name === items[i + 1].name) {
      items[i + 1] = { ...items[i + 1], withIndexPage: true }
      if (a.children && !items[i + 1].children) {
        items[i + 1].children = a.children
      }
      continue
    }

    const title = getMetaTitle(meta[a.name]) || getTitle(a.name)
    const type = getMetaItemType(meta[a.name]) || 'doc'
    const hidden = getMetaHidden(meta[a.name])

    const extendedPageThemeContext = {
      ...pageThemeContext,
      ...meta[a.name]?.theme
    }

    // If the doc is under the active page root.
    const isCurrentDocsTree = route.startsWith(docsRoot)

    const normalizedChildren: any = a.children
      ? normalizePages({
          list: a.children,
          locale,
          defaultLocale,
          route,
          docsRoot: type === 'page' ? a.route : docsRoot,
          underCurrentDocsRoot: underCurrentDocsRoot || isCurrentDocsTree,
          pageThemeContext: extendedPageThemeContext
        })
      : undefined

    const item: Item = {
      ...a,
      title,
      type,
      hidden,
      children: normalizedChildren ? [] : undefined
    }
    const docsItem: DocsItem = {
      ...a,
      title,
      type,
      hidden,
      children: normalizedChildren ? [] : undefined
    }
    const pageItem: PageItem = {
      ...a,
      title,
      type,
      hidden,
      children: normalizedChildren ? [] : undefined
    }

    if (a.route === route) {
      activePath = [item]
      activeType = type
      // There can be multiple matches.
      activeThemeContext = {
        ...activeThemeContext,
        ...extendedPageThemeContext
      }
      switch (type) {
        case 'page':
          activeIndex = topLevelPageItems.length
          break
        case 'doc':
          if (isCurrentDocsTree) {
            activeIndex = flatDocsDirectories.length
          }
      }
    }

    if (hidden) continue

    if (normalizedChildren) {
      if (
        normalizedChildren.activeIndex !== undefined &&
        normalizedChildren.activeType !== undefined
      ) {
        activeThemeContext = normalizedChildren.activeThemeContext
        activeType = normalizedChildren.activeType
        activePath = [item, ...normalizedChildren.activePath]
        switch (activeType) {
          case 'page':
            activeIndex =
              topLevelPageItems.length + normalizedChildren.activeIndex
            break
          case 'doc':
            activeIndex =
              flatDocsDirectories.length + normalizedChildren.activeIndex
            break
        }
        if (a.withIndexPage) {
          if (type === 'doc') {
            activeIndex++
          }
        }
      }
    }

    if (normalizedChildren) {
      switch (type) {
        case 'page':
          // @ts-expect-error normalizedChildren === true
          pageItem.children.push(...normalizedChildren.pageDirectories)
          docsDirectories.push(...normalizedChildren.docsDirectories)

          // If it's a page with children inside, we inject itself as a page too.
          if (normalizedChildren.flatDirectories.length) {
            pageItem.firstChildRoute =
              normalizedChildren.flatDirectories[0].route
            topLevelPageItems.push(pageItem)
          }

          break
        case 'doc':
          if (isCurrentDocsTree) {
            Array.isArray(docsItem.children) &&
              docsItem.children.push(...normalizedChildren.docsDirectories)
            pageDirectories.push(...normalizedChildren.pageDirectories)

            // Itself is a doc page.
            if (item.withIndexPage) {
              flatDocsDirectories.push(docsItem)
            }
          }
      }

      flatDirectories.push(...normalizedChildren.flatDirectories)
      flatDocsDirectories.push(...normalizedChildren.flatDocsDirectories)

      Array.isArray(item.children) &&
        item.children.push(...normalizedChildren.directories)
    } else {
      flatDirectories.push(item)
      switch (type) {
        case 'page':
          topLevelPageItems.push(pageItem)
          break
        case 'doc':
          if (isCurrentDocsTree) {
            flatDocsDirectories.push(docsItem)
          }
      }
    }

    directories.push(item)
    switch (type) {
      case 'page':
        pageDirectories.push(pageItem)
        if (isCurrentDocsTree && underCurrentDocsRoot) {
          docsDirectories.push(pageItem)
        }
        break
      case 'doc':
        if (isCurrentDocsTree) {
          docsDirectories.push(docsItem)
        }
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
    pageDirectories,
    topLevelPageItems
  }
}
