import getTitle from 'title'

function getMetaTitle(meta) {
  if (typeof meta === 'string') return meta
  if (typeof meta === 'object') return meta.title
  return ''
}

function getMetaItemType(meta) {
  if (typeof meta === 'object') return meta.type
  return 'docs'
}

export default function normalizePages(list, locale, defaultLocale, route) {
  let meta
  for (let item of list) {
    if (item.name === 'meta.json' && locale === item.locale) {
      meta = item
      break
    }
    // fallback
    if (!meta && item.name === 'meta') {
      meta = item
    }
  }
  if (!meta) {
    meta = {}
  } else {
    meta = meta.meta
  }

  const metaKeys = Object.keys(meta)
  const hasLocale = new Map()
  if (locale) {
    list.forEach(a =>
      a.locale === locale ? hasLocale.set(a.name, true) : null
    )
  }

  // All directories
  const directories = []
  const flatDirectories = []

  // Docs directories
  const docsDirectories = []
  const flatDocsDirectories = []

  // Page directories
  const pageDirectories = []
  const flatPageDirectories = []

  let activeType
  let activeIndex

  list
    .filter(
      a =>
        // not meta
        a.name !== 'meta.json' &&
        // not hidden routes
        !a.name.startsWith('_') &&
        // locale matches, or fallback to default locale
        (a.locale === locale ||
          ((a.locale === defaultLocale || !a.locale) && !hasLocale.get(a.name)))
    )
    .sort((a, b) => {
      const indexA = metaKeys.indexOf(a.name)
      const indexB = metaKeys.indexOf(b.name)
      if (indexA === -1 && indexB === -1) return a.name < b.name ? -1 : 1
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
    .forEach(a => {
      const title = getMetaTitle(meta[a.name]) || getTitle(a.name)
      const type = getMetaItemType(meta[a.name]) || 'docs'

      if (a.route === route) {
        activeType = type
        switch (type) {
          case 'page':
            activeIndex = flatPageDirectories.length
            break
          case 'docs':
          default:
            activeIndex = flatDocsDirectories.length
        }
      }

      const normalizedChildren = a.children
        ? normalizePages(a.children, locale, defaultLocale, route)
        : undefined

      if (normalizedChildren) {
        activeType = activeType || normalizedChildren.activeType
        activeIndex = activeIndex || normalizedChildren.activeIndex
      }

      const item = {
        ...a,
        title,
        type,
        children: normalizedChildren ? [] : undefined
      }
      const docsItem = {
        ...a,
        title,
        type,
        children: normalizedChildren ? [] : undefined
      }
      const pageItem = {
        ...a,
        title,
        type,
        children: normalizedChildren ? [] : undefined
      }

      if (normalizedChildren) {
        flatDirectories.push(...normalizedChildren.flatDirectories)
        flatPageDirectories.push(...normalizedChildren.flatPageDirectories)
        flatDocsDirectories.push(...normalizedChildren.flatDocsDirectories)

        item.children.push(...normalizedChildren.directories)

        switch (type) {
          case 'page':
            pageItem.children.push(...normalizedChildren.pageDirectories)
            docsDirectories.push(...normalizedChildren.docsDirectories)
            break
          case 'docs':
          default:
            docsItem.children.push(...normalizedChildren.docsDirectories)
            pageDirectories.push(...normalizedChildren.pageDirectories)
        }
      } else {
        flatDirectories.push(item)
        switch (type) {
          case 'page':
            flatPageDirectories.push(pageItem)
            break
          case 'docs':
          default:
            flatDocsDirectories.push(docsItem)
        }
      }

      directories.push(item)
      switch (type) {
        case 'page':
          pageDirectories.push(pageItem)
          break
        case 'docs':
        default:
          docsDirectories.push(docsItem)
      }
    })

  return {
    activeType,
    activeIndex,
    directories,
    flatDirectories,
    docsDirectories,
    flatDocsDirectories,
    pageDirectories,
    flatPageDirectories
  }
}
